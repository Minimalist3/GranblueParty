import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import config from '../config';
import { pool } from '../db';

import { sendError } from './utils'

function createCookie (userid, response) {
  const jwtConfig = {
    algorithm: "HS256",
    expiresIn: "365 days",
    audience: "api",
  };
  const token = jwt.sign(userid, config.jwt.secret, jwtConfig);
  
  const cookieConfig = {
    maxAge: 52 * 60 * 60 * 24 * 7 * 1000, // 1 year
    httpOnly: true,
    sameSite: true,
    secure: config.jwt.secureCookie,
  }
  response.cookie('jwt', token, cookieConfig);
}

function sendSuccess (response, data = null) {
  response.status(200).send({
    data: data
  });
}

export function userRegister (req, response) {
  const username = req.body.username;
  const password = req.body.password;

  // Prevent spaces in username
  if (/([\x00-\x1F\x7F]|\s)/.test(username)) {
    return sendError(response, 422, "Username doesn't match requirements");
  }

  // User and password cannot be empty
  if ( ! username || username.length === 0 || ! password || password.length === 0) {
    return sendError(response, 422, "User and password cannot be empty");
  }

  bcrypt.hash(password, config.jwt.BCRYPT_SALT_ROUNDS)
    .then((hash) => {
      pool.query('INSERT INTO UserAccount (username, password) VALUES ($1, $2) RETURNING userid', [username, hash])
        .then(userid => {
          // Create JWT
          createCookie(userid.rows[0], response);
          sendSuccess(response, {userid: userid.rows[0].userid});
        })
        .catch((e) => {
          if (e.code === '23505') {
            sendError(response, 422, "Username already exists")
          }
          else {
            sendError(response, 500, "There was a problem while registering the user")
          }          
        });
    })
    .catch(() => sendError(response, 500, "Cannot register the user"));
}

export function userLogin (req, response) {
  const data = {
    userid : req.user.userid,
  }
  createCookie(data, response);
  sendSuccess(response, data);
}

export function userLogout (req, response) {
  response.clearCookie("jwt");
  sendSuccess(response);
}

export function userDelete (req, response) {
  const userid = req.user.userid;
  if ( ! /^[0-9]+$/.test(userid)) {
    return sendError(response, 422, "Invalid user ID format");
  }

  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect()
  
    try {
      await client.query('BEGIN');

      const userId = req.user.userid;
      await client.query('DELETE FROM UserCollectionCharacter WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM UserCollectionSummon WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM Party WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM useraccount WHERE userid=$1;', [userId]);

      await client.query('COMMIT');
      userLogout(req, response);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })().catch(() => {
    sendError(response, 500, "Failed to delete user")
  })
}
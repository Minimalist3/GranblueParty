import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import config from '../config';
import { pool } from '../db';

import { buildWhereClause, sendSuccess, sendError, sendResetPasswordEmail } from './utils'

function createCookie(userid, response) {
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

/**
 * Register a new user
 * jwt: false
 */
export function userRegister(req, response) {
  const username = req.body.username;
  const password = req.body.password;
  const captcha = req.body.captcha;
  let email = req.body.email;
  if ( ! email) {
    email = null;
  }

  // Prevent spaces in username
  if (/([\x00-\x1F\x7F]|\s)/.test(username)) {
    return sendError(response, 422, "Username doesn't match requirements");
  }

  // User and password cannot be empty
  if ( ! username || ! password) {
    return sendError(response, 422, "User and password cannot be empty");
  }

  // Honeypot
  if (captcha === undefined || captcha === null || captcha === true) {
    return response.sendStatus(200);
  }

  bcrypt.hash(password, config.jwt.BCRYPT_SALT_ROUNDS)
    .then((hash) => {
      pool.query('INSERT INTO UserAccount (username, password, email) VALUES ($1, $2, $3) RETURNING userid', [username, hash, email])
        .then(userid => {
          // Create JWT
          createCookie(userid.rows[0], response);
          sendSuccess(response, {userid: userid.rows[0].userid});
        })
        .catch((e) => {
          if (e.constraint == 'useraccount_username_key') {
            sendError(response, 422, "Username already exists")
          }
          else if (e.constraint == 'useraccount_email_key') {
            sendError(response, 422, "Email address already registered")
          }
          else {
            sendError(response, 500, "There was a problem while registering the user (" + e.code + ")")
          }          
        });
    })
    .catch(() => sendError(response, 500, "Cannot register the user"));
}

/**
 * jwt: true
 */
export function userInfos(req, response) {
  const {query, values} = buildWhereClause({
    'userId': req.user.userid,
  });

  pool.query(`SELECT username, email FROM UserAccount ${query};`, values)
    .then(res => {
      let data = null;
      if (res.rows.length > 0) {
        data = res.rows[0];
      }
      response.status(200).json(data);
    })
    .catch(_ => response.sendStatus(400));
}

/**
 * jwt: true
 */
export function userSetEmail(req, response) {
  const {query, values} = buidWhereClause({
    'userId': req.user.userid,
  });

  let email = req.body.email;
  if ( ! email) {
    email = null;
  }

  values.push(email);
  pool.query(`UPDATE UserAccount SET email = $2 ${query};`, values)
    .then(_ => response.sendStatus(200))
    .catch(e => {
      if (e.constraint == 'useraccount_email_key') {
        sendError(response, 422, "Email address already registered");
      }
      else {
        response.sendStatus(400);
      }
    });
}

/**
 * Send reset password email
 * jwt: false
 */
export function userSendResetPassword(req, response) {
  const email = req.body.email;
  const captcha = req.body.captcha;
  const {query, values} = buildWhereClause({
    'email': email,
  });

  // Honeypot
  if (captcha === undefined || captcha === null || captcha === true) {
    return response.sendStatus(200);
  }
  if ( ! email) {
    return sendError(response, 422, "Unknown email address");
  }

  pool.query(`SELECT username FROM UserAccount ${query};`, values)
    .then(res => {
      if (res.rows.length === 0) {
        return sendError(response, 422, "Unknown email address");
      }

      // Generate a new unique token
      const username = res.rows[0].username;
      crypto.randomBytes(64, (err, buf) => {
        const token = buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
        if (err) throw err;

        // Add the token to base
        values.push(token);
        pool.query(`UPDATE UserAccount SET resetToken = $2, resetTimestamp = CURRENT_TIMESTAMP ${query};`, values)
          .then(_ => {
            // Send the email
            sendResetPasswordEmail(username, email, token)
              .then(_ => response.sendStatus(200))
              .catch(_ => response.sendStatus(400));
          })
          .catch(_ => response.sendStatus(400));
      });
    })
    .catch(_ => sendError(response, 422, "Unknown email address"));
}

/**
 * Reset user password
 * jwt: false
 */
export function userResetPassword(req, response) {
  const email = req.body.email;
  const token = req.body.token;
  const captcha = req.body.captcha;
  const {query, values} = buildWhereClause({
    'email': email,
  });

  // Honeypot
  if (captcha === undefined || captcha === null || captcha === true) {
    return response.sendStatus(200);
  }
  if ( ! email || ! token) {
    return sendError(response, 422, "Unknown email address");    
  }

  pool.query(`SELECT resetToken, resetTimestamp FROM UserAccount ${query};`, values)
    .then(res => {
      if (res.rows.length === 0) {
        return sendError(response, 422, "Unknown email address");
      }

      // Timestamps are in epoch ms
      const resetToken = res.rows[0].resettoken;
      const resetTimestamp = res.rows[0].resettimestamp;

      if ( ! resetToken || ! resetTimestamp || resetToken !== token) {
        return sendError(response, 422, "Invalid token");
      }

      const gap = Date.now() - resetTimestamp.valueOf();
      if (gap < 0 || gap > 2000000) { // 33min
        return sendError(response, 422, "Reset token is too old");
      }

      const password = req.body.password;
      bcrypt.hash(password, config.jwt.BCRYPT_SALT_ROUNDS)
        .then((hash) => {
          values.push(hash);
          values.push(null); // Remove current resetToken and resetTimestamp
          values.push(null);
          pool.query(`UPDATE UserAccount SET (password, resetToken, resetTimestamp) = ($2, $3, $4) ${query};`, values)
            .then(_ => response.sendStatus(200))
        })
        .catch(() => sendError(response, 500, "Cannot change the password"));
    })
    .catch(_ => sendError(response, 422, "Unknown email address"));
}

/**
 * jwt: true
 */
export function userLogin(req, response) {
  const data = {
    userid : req.user.userid,
  }
  createCookie(data, response);
  sendSuccess(response, data);
}

/**
 * jwt: true
 */
export function userLogout(req, response) {
  response.clearCookie("jwt");
  sendSuccess(response);
}

/**
 * jwt: true
 */
export function userDelete(req, response) {
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
      await client.query('DELETE FROM Arcarum WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM Daily WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM Party WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM FriendSummons WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM UserCollectionCharacter WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM UserCollectionSummon WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM UserAccount WHERE userid=$1;', [userId]);

      await client.query('COMMIT');
      userLogout(req, response);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })()
    .catch(_ => sendError(response, 500, "Failed to delete user"))
}
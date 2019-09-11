import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';

import { pool } from './db';
import config from './config';

passport.use(new LocalStrategy( (username, password, done) => 
{
  pool.query('SELECT * FROM UserAccount WHERE username=$1', [username])
    .then(res => {
      if (res.rows.length != 1) {
        return done(null, false, "Wrong username or password");
      }
      // Test password
      bcrypt.compare(password, res.rows[0].password)
        .then(compared => {
          if (compared) {
            return done(null, res.rows[0]);
          }
          return done(null, false, "Wrong username or password");
        })
        .catch(() => {
          return done(null, false, "Internal hash error");
        });
    })
    .catch(() => {
      return done(null, false, "Wrong username or password");
    });
}));

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
      token = req.cookies['jwt'];
  }
  return token;
};

passport.use(new JWTStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.jwt.secret,
    audience: 'api',
    algorithms: ['HS256'],    
  },
  (jwtPayload, done) => {
    return done(null, jwtPayload);
  }
));

export const passport_authenticate = (method, callback) => {
	return (req, res, next) => {    
		passport.authenticate(method, { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      
			if ( ! user) {
        // Deal with jsonwebtoken errors being objects
        let msg = info;
        if (msg instanceof Object && msg.message !== undefined) {
          msg = msg.message;
        }
        return res.status(401).send({
				  "error": {
					  "code": "401",
					  "message": msg,
          }
        });
      }

			req.user = user;
			return callback(req, res, next);
    })(req, res, next); // IIFE
  };
}

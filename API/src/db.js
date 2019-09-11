import pg from 'pg'

import config from './config';

const pool = new pg.Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.name,
  password: config.db.password,
  port: config.db.port,
});

export {
  pool,
}
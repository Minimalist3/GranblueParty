import { pool } from '../db';
import { buildWhereClause } from './utils'

export function dailyLoad (req, response) {
  const [query, values] = buildWhereClause({
    'userId': req.user.userid,
  });

  pool.query(`SELECT dailyData FROM Daily ${query};`, values)
     .then(res => {
        let data = null;
        if (res.rows.length > 0) {
          data = res.rows[0].dailydata.data;
        }
        response.status(200).json(data);
      })
     .catch(() => { response.sendStatus(400) });
}

export function dailySave (req, response) {
  /**
   * [{
      name: "",
      data: [{id: ''}, ...]
     }, ...]
   */
  const [query, values] = buildWhereClause({
    'userId': req.user.userid,
    'dailyData': {'data': req.body}, // Embed the array in an object to make it work
  });

  pool.query(
   `INSERT INTO Daily (userId, dailyData) VALUES ($1, $2)
    ON CONFLICT ON CONSTRAINT daily_pkey DO UPDATE SET (userId, dailyData) = (excluded.userId, excluded.dailyData);`, values)
  .then(() => response.sendStatus(200))
  .catch(() => { response.sendStatus(400) });
}
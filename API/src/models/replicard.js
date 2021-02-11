import { pool } from '../db';
import { buildWhereClause } from './utils'

export function replicardLoad (req, response) {
  const {query, values} = buildWhereClause({
    'userId': req.user.userid,
  });

  pool.query(`SELECT replicardData FROM Arcarum ${query};`, values)
     .then(res => {
        let data = null;
        if (res.rows.length > 0) {
          data = res.rows[0].replicarddata;
        }
        response.status(200).json(data);
      })
     .catch(() => { response.sendStatus(400) });
}

export function replicardSave (req, response) {
  /**
   * [{
      name: "",
      data: [{id: ''}, ...]
     }, ...]
   */
  const {query, values} = buildWhereClause({
    'userId': req.user.userid,
    'replicardData': req.body, // Embed the array in an object to make it work
  });

  pool.query(
   `INSERT INTO Arcarum (userId, replicardData) VALUES ($1, $2)
    ON CONFLICT ON CONSTRAINT arcarum_pkey DO UPDATE SET (userId, replicardData) = (excluded.userId, excluded.replicardData);`, values)
  .then(() => response.sendStatus(200))
  .catch(() => { response.sendStatus(400) });
}
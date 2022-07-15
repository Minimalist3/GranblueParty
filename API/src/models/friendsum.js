import { pool } from '../db';
import { previews_socket } from '../previews-server'
import { buildWhereClause } from './utils'

export function friendSummonsLoad (req, response, id) {
  let query, values;
  [query, values] = buildWhereClause({
    'userId': id,
  });

  pool.query(`SELECT friendSummonsData, gbfId, EXTRACT(EPOCH FROM updated::timestamp with time zone)::bigint AS updated FROM FriendSummons ${query};`, values)
    .then(res => {
      if (res.rows.length > 0) {
        // Fetch all summons
        const allSummons = res.rows[0].friendsummonsdata.map(s => {
          if (s) {
            [query, values] = buildWhereClause({
              'summonId': s.id
            });
            return pool.query('SELECT * FROM Summon ' + query + ';', values)
              .then(res => {
                res.rows[0].stars = s.uncap;
                return res.rows[0];
              }).catch(_ => {});
          }
          else {
            return Promise.resolve({});
          }
        });

        Promise.all(allSummons)
          .then(s => 
            response.status(200).json({
              gbfid: res.rows[0].gbfid,
              data: s,
              updated: res.rows[0].updated,
            })
          )
          .catch(_ => response.sendStatus(400));
      }
      else {
        response.sendStatus(400);
      }
    })
    .catch(_ => response.sendStatus(400));
}

export function friendSummonsSave (req, response) {
  /**
   * {
      gbfid: "",
      data: [{id: '', uncap: ''}, ...]
     }
   */
  const [query, values] = buildWhereClause({
    'userId': req.user.userid,
    'gbfId': req.body.gbfid,
    'friendSummonsData': JSON.stringify(req.body.data), // Stringify to fix a bug in pg when inserting arrays   
  });

  pool.query(
   `INSERT INTO FriendSummons (userId, gbfId, friendSummonsData, updated) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    ON CONFLICT ON CONSTRAINT friendsummons_pkey DO UPDATE SET
    (gbfId, friendSummonsData, updated) = (excluded.gbfId, excluded.friendSummonsData, excluded.updated);`, values)
  .then(_ => {
    response.sendStatus(200);
    previews_socket.write("f" + req.user.userid + '\n');
  })
  .catch(_ => response.sendStatus(400));
}
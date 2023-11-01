import { pool } from '../db';

import { buildWhereClause } from './utils'
import logger from '../logger';

export function getTeams (req, response) {
  let [query, values] = buildWhereClause({
    'Party.contentId': req.query.c,
    'Party.elementId': req.query.e,
  },
  'WHERE Party.userId = UserAccount.userId AND Party.public = true AND Party.elementId IS NOT NULL AND Party.contentId IS NOT NULL');

  if (req.query.t) {
    values.push(req.query.t);
    query += ` AND Party.updated > now() - '1 day'::interval * $${values.length} `;
  }
  let order = '';
  if (req.query.o == 1) {
    order = 'ORDER BY Party.likes DESC, Party.updated DESC';
  }
  else {
    order = 'ORDER BY Party.updated DESC';
  }

  pool.query(
   `SELECT Party.partyId AS id, Party.partyName AS n, Party.elementId AS e, Party.contentId AS c,
      EXTRACT(EPOCH FROM Party.updated::timestamp with time zone)::bigint AS d, UserAccount.userName AS u,
      (Party.description <> '') AS desc, Party.likes AS l, (Party.video <> '') AS yt
    FROM Party, UserAccount 
    ${query}
    ${order} FETCH FIRST 120 ROWS ONLY;`, values)
  .then(res => response.status(200).json(res.rows))
  .catch(e => {
    logger.error("getTeams", {e: e, req: req});
    response.sendStatus(400)
  });
}
import { pool } from '../db';

import { buildWhereClause } from './utils'

export function getTeams (req, response) {
  let {query, values} = buildWhereClause({
    'Party.contentId': req.query.c,
    'Party.elementId': req.query.e,
  },
  'WHERE Party.userId = UserAccount.userId AND Party.public = true AND Party.elementId IS NOT NULL');

  if (req.query.t) {
    values.push(req.query.t);
    query += ` AND Party.updated > now() - '1 day'::interval * $${values.length} `;
  }

  pool.query(
   `SELECT Party.partyId AS id, Party.partyName AS n, Party.elementId AS e, Party.contentId AS c,
      EXTRACT(EPOCH FROM Party.updated::timestamp with time zone)::bigint AS d, UserAccount.userName AS u,
      (Party.description <> '') AS desc 
    FROM Party, UserAccount 
    ${query}
    ORDER BY Party.updated DESC FETCH FIRST 100 ROWS ONLY;`, values)
  .then(res => response.status(200).json(res.rows))
  .catch(() => { response.sendStatus(400) });
}
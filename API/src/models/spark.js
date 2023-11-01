import { pool } from '../db';
import logger from '../logger';

export function getSparkCharacters (req, response) {
  pool.query(
   `SELECT characterid AS id, nameEn AS n, nameJp AS nj, weapon AS w, rarityId AS r
    FROM Character
    WHERE weapon IS NOT NULL AND drawTypeId IS NOT NULL
    ORDER BY nameen;`)
  .then(res => response.status(200).json(res.rows))
  .catch(e => {
    logger.error("getSparkCharacters", {e: e, req: req});
    response.sendStatus(400)
  });
}

export function getSparkSummons (req, response) {
  pool.query(
   `SELECT summonid AS id, nameEn AS n, nameJp AS nj
    FROM Summon
    WHERE rarityid = 2 AND drawTypeId >= 500
    ORDER BY nameen;`)
  .then(res => response.status(200).json(res.rows))
  .catch(e => {
    logger.error("getSparkSummons", {e: e, req: req});
    response.sendStatus(400)
  });
}
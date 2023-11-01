import { pool } from '../db';
import logger from '../logger';

export function getReleaseCharacters (req, response) {
  pool.query(
   `SELECT characterid AS id, nameen AS n, namejp AS nj, rarityId AS ri, elementid AS e, drawtypeid AS d, releasedate AS rd
    FROM character
    ORDER BY releasedate DESC, characterid;`)
    .then(res => response.status(200).json(res.rows))
    .catch(e => {
      logger.error("getReleaseCharacters", {e: e, req: req});
      response.sendStatus(400)
    });
}

export function getReleaseSummons (req, response) {
  pool.query(
   `SELECT summonid AS id, nameen AS n, namejp AS nj, rarityid AS ri, elementid AS e, drawtypeid AS d, releasedate AS rd
    FROM summon
    WHERE releasedate IS NOT null AND rarityid = 2
    ORDER BY releasedate DESC, summonid;`)
    .then(res => response.status(200).json(res.rows))
    .catch(e => {
      logger.error("getReleaseSummons", {e: e, req: req});
      response.sendStatus(400)
    });
}
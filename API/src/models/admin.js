import { pool } from '../db';
import { sendError } from './utils'
import logger from '../logger';

export function getAdminWeapons (req, response) {
  pool.query(
   `SELECT ws.*, (
      SELECT json_agg(w) FROM (
        SELECT weapon.weaponid, weapon.nameen
        FROM weapon, weapon_skill
        WHERE weapon_skill.skilldataid = ws.skilldataid
        AND weapon_skill.weaponid = weapon.weaponid
      ) AS w
    ) AS weapons
    FROM Weapon_Skilldata ws
    GROUP BY ws.skillname, ws.icon, ws.skilldataid
    ORDER BY ws.icon ASC;`
  )
  .then(res => response.status(200).json(res.rows))
  .catch(e => {
    logger.error("getAdminWeapons", {e: e, req: req});
    response.sendStatus(400)
  });
}

export function saveAdminWeapons (req, response) {
  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');

      for (let i of req.body.data) {
        await client.query("UPDATE Weapon_Skilldata SET data = $2 WHERE skilldataid = $1;", i)
      }

      await client.query('COMMIT');
      response.sendStatus(200);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })().catch(e => {
    logger.error("saveAdminWeapons", {e: e, req: req});
    sendError(response, 400, e)
  })
}

export function getAdminSummons (req, response) {
  pool.query(
   `SELECT summon.nameen, summon.starsmax, summon.data, summonaura.* FROM summon, summonaura
    WHERE summon.summonid = summonaura.summonid
    ORDER BY summonaura.ignore ASC, summon.rarityid DESC, summon.nameen ASC;`
  )
  .then(res => response.status(200).json(res.rows))
  .catch(() => response.sendStatus(400));
}

export function saveAdminSummons (req, response) {
  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');

      for (let i of req.body.ignore) {
        await pool.query("UPDATE summonaura SET ignore = $2 WHERE summonid = $1;", i)
      }
      for (let i of req.body.data) {
        await pool.query("UPDATE summon SET data = $2 WHERE summonid = $1;", i)
      }

      await client.query('COMMIT');
      response.sendStatus(200);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })().catch(e => {
    logger.error("saveAdminSummons", {e: e, req: req});
    sendError(response, 400, e)
  })
}
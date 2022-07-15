import { pool } from '../db';
import { buildWhereClause } from './utils'

export function getTrackerCharacters (req, response, userid) {
  pool.query(
     `SELECT Character.characterId AS id, Character.nameEn AS n, Character.namejp AS nj, Character.rarityId AS ri,
      Character.elementId AS e, Character.characterTypeId AS t, Character.raceId AS ra,
      Character.starsbase AS sb, Character.starsmax AS sm,
      Character.drawtypeid AS d,
      array_agg(WeaponSpecialty.weaponTypeId ORDER BY WeaponSpecialty.weaponTypeId ASC) AS w,
      UserCollectionCharacter.owned AS owned,
      COALESCE(UserCollectionCharacter.stars, Character.starsmax) AS sc,
      COALESCE(UserCollectionCharacter.awakening, 0) as aw
      FROM Character
      INNER JOIN WeaponSpecialty
        ON Character.characterId = WeaponSpecialty.characterId
      LEFT OUTER JOIN UserCollectionCharacter
        ON character.characterid = UserCollectionCharacter.characterid
        AND UserCollectionCharacter.userid = ${userid} 
      GROUP BY Character.characterId, UserCollectionCharacter.owned, UserCollectionCharacter.stars, UserCollectionCharacter.awakening
      ORDER BY Character.nameEn ASC;`)
    .then(res => response.status(200).json(res.rows))
    .catch(() => response.sendStatus(400));
}

export function getTrackerSummons (req, response, userid) {
  const [query, values] = buildWhereClause({
    'rarityId': 2,
  });

  pool.query(
     `SELECT Summon.summonId AS id, Summon.nameEn AS n, Summon.nameJp AS nj, Summon.rarityId AS ri,
      Summon.elementId AS e, Summon.starsbase AS sb, Summon.starsmax AS sm, 
      Summon.drawtypeid AS d,
      UserCollectionSummon.owned AS owned,
      COALESCE(UserCollectionSummon.stars, 0) AS sc
      FROM Summon 
      LEFT OUTER JOIN UserCollectionSummon
        ON Summon.summonId = UserCollectionSummon.summonId
        AND UserCollectionSummon.userid = ${userid} 
      ${query} GROUP BY Summon.summonId, UserCollectionSummon.owned, UserCollectionSummon.stars
      ORDER BY Summon.nameEn ASC;`, values)
    .then(res => response.status(200).json(res.rows))
    .catch(() => response.sendStatus(400));
}

export function saveCollection (req, response) {
  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect()
  
    try {
      await client.query('BEGIN');

      const userId = req.user.userid;
      for (let chara of req.body.c) {
        await client.query(
          `INSERT INTO UserCollectionCharacter (userid, characterid, stars, owned, awakening)
           VALUES (${userId}, $1, $2, $3, $4)
           ON CONFLICT (userid, characterid) DO UPDATE SET (stars, owned, awakening) = (Excluded.stars, Excluded.owned, Excluded.awakening);`, chara);
      }
      for (let summ of req.body.s) {
        await client.query(
        `INSERT INTO UserCollectionSummon (userid, summonid, stars, owned)
          VALUES (${userId}, $1, $2, $3)
          ON CONFLICT (userid, summonid) DO UPDATE SET (stars, owned) = (Excluded.stars, Excluded.owned);`, summ);
      }

      await client.query('COMMIT');
      response.sendStatus(200);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => {
    response.sendStatus(400)
  })
}
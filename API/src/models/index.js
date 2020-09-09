import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import config from '../config';
import { pool } from '../db';
import { previews_socket } from '../previews-server'
/**
 * Utility functions
 */

const buildWhereClause = (data) => {
  let query = '';
  let values = [];
  let counter = 1;
  for (const key in data) {
    if (data[key] != undefined) {
      if (query.length == 0) {
        query = ' WHERE ';
      }
      else {
        query += ' AND ';
      }

      query += key + '=$' + counter;
      values.push(data[key]);
      counter++;
    }
  }
  return {query, values};
}

/**
 * Characters
 */

const getAllCharacters = (req, response) => {
  const {query, values} = buildWhereClause({
    'rarityId': req.query.rarity,
    'elementId': req.query.element,
    'characterTypeId': req.query.type,
    'raceId': req.query.race
  });

  pool.query('SELECT Character.characterId AS id, Character.nameEn AS n, Character.nameJp AS nj, Character.rarityId AS ri,' + 
             'Character.elementId AS e, Character.characterTypeId AS t, Character.raceId AS ra,' +
             'array_agg(WeaponSpecialty.weaponTypeId ORDER BY WeaponSpecialty.weaponTypeId ASC) AS w ' +
             'FROM Character INNER JOIN WeaponSpecialty ON Character.characterId = WeaponSpecialty.characterId ' +
              query + ' GROUP BY Character.characterId ORDER BY Character.nameEn ASC;', values)
    .then(res => response.status(200).json(res.rows))
    .catch(() => response.sendStatus(400));
}

const getCharacterById = (id) => {
  if (id == null) return Promise.resolve(null);

  const {query, values} = buildWhereClause({
    'Character.characterId': id,
    'WeaponSpecialty.characterId': id
  });

  return pool.query(
    `SELECT Character.*, Character.starsmax AS stars, array_agg(WeaponSpecialty.weaponTypeId) AS weaponTypeId,
     (SELECT json_agg(skills) FROM (
        SELECT
          CharacterSkill.CharacterSkillOrder AS index,
          CharacterSkill.CharacterSkillName AS name, 
          CharacterSkill.CharacterSkillObtain AS obtain
        FROM CharacterSkill
        WHERE Character.characterId = CharacterSkill.characterId
     ) AS skills ) AS skills 
     FROM Character, WeaponSpecialty ${query} GROUP BY Character.characterId;`, values)
}
const getCharacterBySkinId = (id) => {
  if (id == null) return Promise.resolve(null);

  const {query, values} = buildWhereClause({
    'Skin_Character.skinId': id,
  });

  return pool.query(
   `SELECT Character.*, Character.starsmax AS stars, array_agg(WeaponSpecialty.weaponTypeId) AS weaponTypeId,
    (SELECT json_agg(skills) FROM (
      SELECT CharacterSkill.CharacterSkillName AS name, 
        CharacterSkill.CharacterSkillObtain AS obtain
      FROM CharacterSkill
      WHERE Character.characterId = CharacterSkill.characterId
    ) AS skills ) AS skills 
    FROM Character, WeaponSpecialty, Skin_Character
    ${query} AND Character.characterId = Skin_Character.characterId AND WeaponSpecialty.characterId = Skin_Character.characterId 
    GROUP BY Character.characterId;`, values)
}
const getCharacter = (req, response) => {
  getCharacterById(req.params.id)
    .then(res => response.status(200).json(res.rows[0]))
    .catch(() => response.sendStatus(400));
}

/**
 * Skills
 */
const getSkills = (req, response) => {
  const varTrue = true;
  const {query, values} = buildWhereClause({
    'family': req.query.family,
    'exMastery': varTrue,
  });

  pool.query('SELECT skillId AS id, nameEn AS n FROM ClassSkill ' + query + ' OR family IS NULL ORDER BY CASE WHEN family Is NULL Then 1 Else 0 End, family, nameEn ASC;', values)
    .then(res => response.status(200).json(res.rows))
    .catch(() => response.sendStatus(400));
}

const getSkillById = (id) => {
  if (id === null) return Promise.resolve(null);

  const {query, values} = buildWhereClause({
    'skillId': id
  });

  return pool.query('SELECT * FROM ClassSkill ' + query + ';', values)
}
const getSkillByName = (name) => {
  if (name === null) return Promise.resolve(null);

  const {query, values} = buildWhereClause({
    'nameEn': name
  });

  return pool.query('SELECT * FROM ClassSkill ' + query + ';', values)
}
const getSkill = (req, response) => {
  getSkillById(req.params.id)
    .then(res => response.status(200).json(res.rows[0]))
    .catch(() => response.sendStatus(400));
}

/**
 * Summons
 */
const getAllSummons = (req, response) => {
  const {query, values} = buildWhereClause({
    'rarityId': req.query.rarity,
    'elementId': req.query.element,
  });

  pool.query('SELECT summonId AS id, nameEn AS n, nameJp AS nj, rarityId AS ri, elementId AS e FROM Summon ' + query + ' ORDER BY nameEn ASC;', values)
    .then(res => response.status(200).json(res.rows))
    .catch(() => response.sendStatus(400));
}

const getSummonById = (id) => {
  if (id == null) return Promise.resolve(null);

  const {query, values} = buildWhereClause({
    'summonId': id
  });

  return pool.query('SELECT *, starsmax AS stars FROM Summon ' + query + ';', values);
}
const getSummon = (req, response) => {
  getSummonById(req.params.id)
    .then(res => response.status(200).json(res.rows[0]))
    .catch(() => response.sendStatus(400));
}

/**
 * Classes
 */

const getAllClasses = (req, response) => {
  pool.query('SELECT classId AS id, nameEn AS n, row FROM Class ORDER BY row DESC, nameEn ASC;')
      .then(res => response.status(200).json(res.rows))
      .catch(() => response.sendStatus(400));  
}

const getClassById = (id) => {
  if (id == null) return Promise.resolve(null);

  const {query, values} = buildWhereClause({
    'classId': id,
  });

  return pool.query('SELECT Class.*, (' +
    'SELECT json_agg(ClassSkill.* ORDER BY Class_ClassSkill.index ASC) FROM ClassSkill, Class_ClassSkill ' +
    'WHERE ClassSkill.skillid = Class_ClassSkill.skillid AND Class_ClassSkill.classid=Class.classid) AS skills ' +
    'FROM Class ' + query + ';', values)
}
const getClass = (req, response) => {
  getClassById(req.params.id)
      .then(res => response.status(200).json(res.rows[0]))
      .catch(() => response.sendStatus(400));
}

/**
 * Weapons
 */
const getAllWeapons = (req, response) => {
  const {query, values} = buildWhereClause({
    'rarityId': req.query.rarity,
    'elementId': req.query.element,
    'weaponTypeId': req.query.weapon,
  });

  pool.query('SELECT weaponId AS id, nameEn AS n, nameJp AS nj, rarityId AS ri, elementId AS e, weaponTypeId AS w FROM Weapon ' + query + ' ORDER BY nameEn ASC;', values)
      .then(res => response.status(200).json(res.rows))
      .catch(() => response.sendStatus(400));
}

const getWeaponById = (id) => {
  if (id == null) return Promise.resolve(null);

  const {query, values} = buildWhereClause({
    'weaponId': id
  });

  return pool.query(
   `SELECT Weapon.*, Weapon.starsmax AS stars, (
      SELECT json_agg(skills) FROM (
        SELECT json_agg(to_jsonb(skills) - 'slot') AS skills FROM (
          SELECT
            Weapon_Skill.slot AS slot,
            Weapon_Skill.level AS level,
            Weapon_Skill.keyid AS keyid,
            Weapon_Skilldata.skillname AS name,
            Weapon_Skilldata.icon AS icon,
            Weapon_Skilldata.data->'data' AS data,
            Weapon_Skilldata.boost AS boost
          FROM Weapon_Skill, Weapon_Skilldata
          WHERE Weapon_Skill.weaponid = Weapon.weaponid
          AND Weapon_Skill.skilldataid = Weapon_Skilldata.skilldataid
          ORDER BY Weapon_Skill.level ASC
        ) AS skills
        GROUP BY slot
      ) AS skills
    ) AS skills
    FROM Weapon ${query};`, values);
}
const getWeapon = (req, response) => {
  getWeaponById(req.params.id)
      .then(res => response.status(200).json(res.rows[0]))
      .catch(() => response.sendStatus(400));
}

/**
 * Party
 */
const getPartyByJSON = (req, response) => {
  let party = {
    classe: req.body.classe === undefined ? null : req.body.classe,
    class_skills: req.body.skills === undefined ? null : req.body.skills,
    characters: req.body.characters === undefined ? null : req.body.characters,
    summons: req.body.summons === undefined ? null : req.body.summons,
    weapons: req.body.weapons === undefined ? null : req.body.weapons,
  };

  let getSkillsById = true;
  if (party.class_skills === null && req.body.class_skills) {
    getSkillsById = false;
    party.class_skills = req.body.class_skills;
  }

  return getParty(party, getSkillsById, response);
}

const getPartyById = (req, response) => {
  const {query, values} = buildWhereClause({
    'partyId': req.params.id,
  });

  pool.query(`SELECT partyData, EXTRACT(EPOCH FROM updated)::bigint AS updated FROM party ${query}`, values)
    .then(res => {
      res.rows[0].partydata.updated = res.rows[0].updated;
      getParty(res.rows[0].partydata, true, response)
    })
    .catch(() => response.sendStatus(400));
}

const getParty = (party, getSkillsById, response) => {
  if (party.classe !== null) {
    party.classe = getClassById(party.classe).then(res => res.rows[0]).catch(() => null);
  }
  if (party.class_skills) {
    party.class_skills = party.class_skills.map(e => {
      if (getSkillsById) {
        return getSkillById(e).then(res => res.rows[0]).catch(() => null)
      }
      else {
        return getSkillByName(e).then(res => res.rows[0]).catch(() => null)
      }
    });
  }
  if (party.characters) {
    party.characters = party.characters.map(e => {
      if (e >= 3710000) {
        return getCharacterBySkinId(e).then(res => res.rows[0]).catch(() => null)
      }
      else {
        return getCharacterById(e).then(res => res.rows[0]).catch(() => null)
      }
    });

    while (party.characters.length < 5) {
      party.characters.push(null);
    }
  }
  if (party.summons) {
    party.summons = party.summons.map(e => getSummonById(e).then(res => res.rows[0]).catch(() => null));

    while (party.summons.length < 6) {
      party.summons.push(null);
    }
  }
  if (party.weapons) {
    party.weapons = party.weapons.map(e => getWeaponById(e).then(res => res.rows[0]).catch(() => null));

    while (party.weapons.length < 10) {
      party.weapons.push(null);
    }
  }
  
  // Flatten object
  let partyEntries = new Map();
  let partyValues = [];
  Object.entries(party)
        .forEach(entry => {
          partyEntries.set(entry[0], entry[1] instanceof Array ? entry[1].length : 1);
          partyValues = partyValues.concat(entry[1]);
        });

  // Wait for all promises
  let index = 0;
  Promise.all(partyValues)
    .then(res => {
      // Rebuild object
      partyEntries.forEach((value, key) => {
        if (value === 1) {
          party[key] = res[index];
        }
        else {
          party[key] = res.slice(index, index + value);
        }
        index += value;
      });

      response.status(200).json(party);
    })
    .catch(() => response.sendStatus(400));
}

const saveParty = (req, response) => {
  /* Body:
    {
      id: [int or null],
      name: [string],
      data: [object]
    }
   */
  const userId = req.user.userid;
  const partyId = req.body.id;
  const partyName = req.body.name;
  const partyData = req.body.data;
  
  // New party
  if (partyId === null) {
    pool.query(
     `INSERT INTO Party (userid, partyname, partydata, updated) VALUES (${userId}, $1, $2, CURRENT_TIMESTAMP) 
      ON CONFLICT DO NOTHING
      RETURNING partyid AS id;`, [partyName, partyData])
    .then((res) => {
      response.status(200).json(res.rows[0]);
      previews_socket.write(res.rows[0].id + '\n');
    })
    .catch(() => response.sendStatus(400));
  }
  // Modify existing party
  else {
    // Compare with current user id
    const {query, values} = buildWhereClause({
      'partyId': partyId,
    });

    pool.query(`SELECT userid FROM Party ${query}`, values)
      .then(res => {
        if (res.rows.length !== 1) {
          return sendError(response, 400, "Party not found");
        }
        if (res.rows[0].userid !== userId) {
          return sendError(response, 400, "User doesn't own this party");
        }

        values.push(partyName);
        values.push(partyData);
        pool.query(`UPDATE party SET partyName = $2, partyData = $3, updated = CURRENT_TIMESTAMP ${query};`, values)
          .then(_ => {
            response.status(200).json({id: partyId});
            previews_socket.write(partyId + '\n');
          })
          .catch(_ => response.sendStatus(400));
      })
      .catch(() => response.sendStatus(400));
  }
}

const deleteParty = (req, response) => {
  /* Body:
    {
      id: [int]
    }
   */
  const userId = req.user.userid;
  const partyId = req.body.id;

  // Compare with current user id
  const {query, values} = buildWhereClause({
    'partyId': partyId,
  });

  pool.query(`SELECT userid FROM Party ${query};`, values)
    .then(res => {
      if (res.rows.length !== 1) {
        return sendError(response, 400, "Party not found");
      }
      if (res.rows[0].userid !== userId) {
        return sendError(response, 400, "User doesn't own this party");
      }
      
      pool.query(`DELETE FROM Party ${query};`, values)
        .then(() => response.sendStatus(200))
        .catch(() => response.sendStatus(400));
    })
    .catch(() => response.sendStatus(400));
}

const listParties = (req, response) => {
  const userId = req.user.userid;

  const {query, values} = buildWhereClause({
    'userId': userId,
  });

  pool.query(`SELECT partyId AS id, partyName AS name FROM Party ${query} ORDER BY partyId;`, values)
    .then(res => response.status(200).json(res.rows))
    .catch((e) => response.sendStatus(400));
}

/** 
 * Collection Tracker
 */
const getTrackerCharacters = (req, response, userid) => {
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

const getTrackerSummons = (req, response, userid) => {
  const {query, values} = buildWhereClause({
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

const saveCollection = (req, response) => {
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

/**
 * Admin queries
 */
const getAdminWeapons = (req, response) => {
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
  .catch((e) => { console.log(e); response.sendStatus(400) } );
}

const saveAdminWeapons = (req, response) => {
  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');

      for (let i of req.body.data) {
        await pool.query("UPDATE Weapon_Skilldata SET data = $2 WHERE skilldataid = $1;", i)
      }

      await client.query('COMMIT');
      response.sendStatus(200);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => sendError(response, 400, e))  
}

const getAdminSummons = (req, response) => {
  pool.query(
   `SELECT summon.nameen, summon.starsmax, summon.data, summonaura.* FROM summon, summonaura
    WHERE summon.summonid = summonaura.summonid
    ORDER BY summonaura.ignore ASC, summon.rarityid DESC, summon.nameen ASC;`
  )
  .then(res => response.status(200).json(res.rows))
  .catch(() => response.sendStatus(400));
}

const saveAdminSummons = (req, response) => {
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
  })().catch((e) => sendError(response, 400, e))  
}

/**
 * User queries
 */
const createCookie = (userid, response) => {
  const jwtConfig = {
    algorithm: "HS256",
    expiresIn: "365 days",
    audience: "api",
  };
  const token = jwt.sign(userid, config.jwt.secret, jwtConfig);
  
  const cookieConfig = {
    maxAge: 52 * 60 * 60 * 24 * 7 * 1000, // 1 year
    httpOnly: true,
    sameSite: true,
    secure: config.jwt.secureCookie,
  }
  response.cookie('jwt', token, cookieConfig);
}

const sendError = (response, status, message) => {
  response.status(status).send({
    "error": {
      "code": status.toString(),
      "message": message,
    }
  });
}

const sendSuccess = (response, data = null) => {
  response.status(200).send({
    data: data
  });
}

const userRegister = (req, response) => {
  const username = req.body.username;
  const password = req.body.password;

  // Prevent spaces in username
  if (/([\x00-\x1F\x7F]|\s)/.test(username)) {
    return sendError(response, 422, "Username doesn't match requirements");
  }

  // User and password cannot be empty
  if ( ! username || username.length === 0 || ! password || password.length === 0) {
    return sendError(response, 422, "User and password cannot be empty");
  }

  bcrypt.hash(password, config.jwt.BCRYPT_SALT_ROUNDS)
    .then((hash) => {
      pool.query('INSERT INTO UserAccount (username, password) VALUES ($1, $2) RETURNING userid', [username, hash])
        .then(userid => {
          // Create JWT
          createCookie(userid.rows[0], response);
          sendSuccess(response, {userid: userid.rows[0].userid});
        })
        .catch((e) => {
          if (e.code === '23505') {
            sendError(response, 422, "Username already exists")
          }
          else {
            sendError(response, 500, "There was a problem while registering the user")
          }          
        });
    })
    .catch(() => sendError(response, 500, "Cannot register the user"));
}

const userLogin = (req, response) => {
  const data = {
    userid : req.user.userid,
  }
  createCookie(data, response);
  sendSuccess(response, data);
}

const userLogout = (req, response) => {
  response.clearCookie("jwt");
  sendSuccess(response);
}

const userDelete = (req, response) => {
  const userid = req.user.userid;
  if ( ! /^[0-9]+$/.test(userid)) {
    return sendError(response, 422, "Invalid user ID format");
  }

  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect()
  
    try {
      await client.query('BEGIN');

      const userId = req.user.userid;
      await client.query('DELETE FROM UserCollectionCharacter WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM UserCollectionSummon WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM Party WHERE userid=$1;', [userId]);
      await client.query('DELETE FROM useraccount WHERE userid=$1;', [userId]);

      await client.query('COMMIT');
      userLogout(req, response);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })().catch(() => {
    sendError(response, 500, "Failed to delete user")
  })
}

/**
 * Release Schedule
 */
const getReleaseCharacters = (req, response) => {
  pool.query(
   `SELECT characterid AS id, nameen AS n, namejp AS nj, rarityId AS ri, elementid AS e, drawtypeid AS d, releasedate AS rd
    FROM character
    ORDER BY releasedate DESC, characterid;`)
    .then(res => response.status(200).json(res.rows))
    .catch(() => response.sendStatus(400));
}

const getReleaseSummons = (req, response) => {
  pool.query(
   `SELECT summonid AS id, nameen AS n, namejp AS nj, rarityid AS ri, elementid AS e, drawtypeid AS d, releasedate AS rd
    FROM summon
    WHERE releasedate IS NOT null AND rarityid = 2
    ORDER BY releasedate DESC, summonid;`)
    .then(res => response.status(200).json(res.rows))
    .catch(() => response.sendStatus(400));
}

/**
 * Daily Grind
 */

const dailyLoad = (req, response) => {
  const {query, values} = buildWhereClause({
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

const dailySave = (req, response) => {
  /**
   * [{
      name: "",
      data: [{id: ''}, ...]
     }, ...]
   */
  const {query, values} = buildWhereClause({
    'userId': req.user.userid,
    'dailyData': {'data': req.body}, // Embed the array in an object to make it work
  });

  pool.query(
   `INSERT INTO Daily (userId, dailyData) VALUES ($1, $2)
    ON CONFLICT ON CONSTRAINT daily_pkey DO UPDATE SET (userId, dailyData) = (excluded.userId, excluded.dailyData);`, values)
  .then(() => response.sendStatus(200))
  .catch(() => { response.sendStatus(400) });
}


export default {
  getAllCharacters,
  getCharacter,

  getAllSummons,
  getSummon,

  getAllClasses,
  getClass,

  getSkills,
  getSkill,

  getAllWeapons,
  getWeapon,

  getPartyByJSON,
  getPartyById,
  saveParty,
  deleteParty,
  listParties,

  getTrackerCharacters,
  getTrackerSummons,
  saveCollection,

  getAdminWeapons,
  saveAdminWeapons,
  getAdminSummons,
  saveAdminSummons,

  userRegister,
  userLogin,
  userLogout,
  userDelete,

  getReleaseCharacters,
  getReleaseSummons,

  dailyLoad,
  dailySave,
}
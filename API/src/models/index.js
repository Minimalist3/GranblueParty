import { pool } from '../db';
import { previews_socket } from '../previews-server'

import { buildWhereClause, sendError } from './utils'

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

  pool.query(
   `SELECT Character.characterId AS id, Character.nameEn AS n, Character.nameJp AS nj, Character.rarityId AS ri,
    Character.elementId AS e, Character.characterTypeId AS t, Character.raceId AS ra,
    array_agg(WeaponSpecialty.weaponTypeId ORDER BY WeaponSpecialty.weaponTypeId ASC) AS w
    FROM Character INNER JOIN WeaponSpecialty ON Character.characterId = WeaponSpecialty.characterId
    ${query} GROUP BY Character.characterId ORDER BY Character.nameEn ASC;`, values)
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

// ULB summons have a different id, for some reason
function convertArcarumSummon(id) {
  switch(id) {
    case 2040313:
      return 2040236; // Justice
    case 2040314:
      return 2040237;	// The Hanged Man
    case 2040315:
      return 2040238;	// Death
    case 2040316:
      return 2040239;	// Temperance
    case 2040317:
      return 2040240;	// The Devil
    case 2040318:
      return 2040241;	// The Tower
    case 2040319:
      return 2040242;	// The Star
    case 2040320:
      return 2040243;	// The Moon
    case 2040321:
      return 2040244;	// The Sun	
    case 2040322:
      return 2040245;	// Judgement
  }
  return id;
}

const getSummonById = (id) => {
  if (id == null) return Promise.resolve(null);

  const {query, values} = buildWhereClause({
    'summonId': convertArcarumSummon(id)
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

  ... require('./admin'),
  ... require('./daily'),  
  ... require('./release'),
  ... require('./replicard'),  
  ... require('./search'),
  ... require('./spark'),
  ... require('./tracker'),
  ... require('./user'),
}
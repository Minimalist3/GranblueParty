import { pool } from '../db';

export function searchCharacters (req, response) {
  pool.query(`SELECT Character.characterId AS id, Character.nameEn AS n, Character.rarityId AS ri,
      Character.elementId AS e, Character.characterTypeId AS t, Character.raceId AS ra,
      array_agg(WeaponSpecialty.weaponTypeId ORDER BY WeaponSpecialty.weaponTypeId ASC) AS w,
     (SELECT json_agg(skills) FROM (
        SELECT
          CharacterSkill.CharacterSkillName AS n, 
          CharacterSkill.CharacterSkillDescription AS d
        FROM CharacterSkill
        WHERE Character.characterId = CharacterSkill.characterId
        ORDER BY CharacterSkill.CharacterSkillOrder
     ) AS skills ) AS s,
     (SELECT json_agg(ougi) FROM (
        SELECT
          CharacterOugi.OugiName AS n, 
          CharacterOugi.OugiDescription AS d
        FROM CharacterOugi
        WHERE Character.characterId = CharacterOugi.characterId
        ORDER BY CharacterOugi.OugiIndex
     ) AS ougi ) AS o
      FROM Character INNER JOIN WeaponSpecialty ON Character.characterId = WeaponSpecialty.characterId
      GROUP BY Character.characterId ORDER BY Character.nameEn ASC;`)
  .then(res => response.status(200).json(res.rows))
  .catch((e) => { console.log(e); response.sendStatus(400) });
}

export function searchWeapons (req, response) {
  pool.query(`SELECT Weapon.weaponid AS id, Weapon.nameen AS n, Weapon.elementid AS e, Weapon.weapontypeid AS w,
    Weapon_Ougi.OugiMLB AS o1, Weapon_Ougi.OugiFLB AS o2, Weapon_Ougi.OugiULB AS o3, (
    SELECT json_agg(to_jsonb(skills) - 'rownum') FROM (
      SELECT
        row_number() over (partition by slot ORDER BY Weapon_Skill.level DESC) as rownum,
        Weapon_Skilldata.skillname AS n,
        Weapon_Skill.description AS d
      FROM Weapon_Skill, Weapon_Skilldata
      WHERE Weapon_Skill.weaponid = Weapon.weaponid
      AND Weapon_Skill.skilldataid = Weapon_Skilldata.skilldataid
    ) AS skills
    WHERE rownum <= 1
  ) AS s
  FROM Weapon, Weapon_Ougi
  WHERE Weapon.weaponid = Weapon_Ougi.weaponid
  ORDER BY Weapon.nameen;`)
  .then(res => response.status(200).json(res.rows))
  .catch(() => { response.sendStatus(400) });
}
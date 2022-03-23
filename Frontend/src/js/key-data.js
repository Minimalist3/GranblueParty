const getSkillByName = (name) => {
  for (let [keyid, keys] of Object.entries(data)) {
    for (let entry of keys) {
      if (name === entry.name) {
        entry['level'] = 1;
        entry['keyid'] = parseInt(keyid, 10);
        return entry;
      }
    }
  }

  return null;
}

// Atma builder

function getBaseData(weapon) {
  return [
    {"percent":{"1":1,"10":15,"15":20,"20":25},"restriction":{"weapon":[weapon]},"aura_type":"ex","stat":"atk"},
    {"percent":{"1":1,"10":10,"15":15,"20":20},"restriction":{"weapon":[weapon]},"aura_type":"normal","stat":"hp"},
  ];
}
function getAtmaWeapon(name, keyid, weapon) {
  return [
    {
      name: name + ' Dominion',
      icon: 'ws_skill_weapon_atk_' + keyid + '.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: keyid,
      data: [
        {"percent":{"1":10,"10":25,"15":30,"20":35},"restriction":{"weapon":[weapon]},"aura_type":"ex","stat":"atk"},
        {"percent":{"1":1,"10":10,"15":15,"20":20},"restriction":{"weapon":[weapon]},"aura_type":"normal","stat":"hp"},
      ],
    },
    {
      name: name + ' Parity',
      icon: 'ws_skill_weapon_da_' + keyid + '.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: keyid,
      data: [
        ... getBaseData(weapon),
        {"percent":{"1":2,"10":20,"15":22.5,"20":25},"restriction": {"weapon":[weapon]},"aura_type":"normal","stat":"da"},
        {"percent":{"1":2,"10":20,"15":22.5,"20":25},"restriction": {"weapon":[weapon]},"aura_type":"normal","stat":"ta"},
      ],
    },
    {
      name: name + ' Utopia',
      icon: 'ws_skill_weapon_hp_' + keyid + '.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: keyid,
      data: [
        {"percent":{"1":1,"10":15,"15":20,"20":25},"restriction":{"weapon":[weapon]},"aura_type":"ex","stat":"atk"},
        {"percent":{"1":2,"10":20,"15":25,"20":30},"restriction":{"weapon":[weapon]},"aura_type":"normal","stat":"hp"},
      ],
    },
    {
      name: name + ' Plenum',
      icon: 'ws_skill_weapon_whole_' + keyid + '.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: keyid,
      data: [
        ... getBaseData(weapon),
        {"percent":{"1":53.7},"restriction": {"weapon":[weapon]},"aura_type":"normal","stat":"stamina"},
      ],
    },
    {
      name: name + ' Ultio',
      icon: 'ws_skill_weapon_backwater_' + keyid + '.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: keyid,
      data: [
        ... getBaseData(weapon),
        {"percent":{"1":0.83,"10":10,"15":12.5,"20":13.5},"restriction": {"weapon":[weapon]},"aura_type":"normal","stat":"enmity"},
      ],
    },
    {
      name: name + ' Ars',
      icon: 'ws_skill_weapon_tech_' + keyid + '.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: keyid,
      data: [
        ... getBaseData(weapon),
        {"percent":{"1":1,"10":15,"15":17.5,"20":20},"restriction": {"weapon":[weapon]},"aura_type":"normal","stat":"crit"},
      ],
    }
  ];
}

// Opus 3rd builder

function getOpusThirdOmega(name, keyid, element) {
  const elemid = keyid - 20;
  return [
    {
      name: name + '\'s Stamina II',
      icon: 'ws_skill_whole_m_' + elemid + '_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: keyid,
      data: [
        {"percent": {"1": 56.4}, "aura_type": "omega", "stat": "stamina", "restriction": {"element": [element] }}
      ]
    },
    {
      name: name + '\'s Enmity III',
      icon: 'ws_skill_backwater_m_' + elemid + '_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: keyid,
      data: [
        {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": [element]}, "aura_type": "omega", "stat": "enmity"}
      ]
    },
    {
      name: name + '\'s Trium II',
      icon: 'ws_skill_ta_m_' + elemid + '_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: keyid,
      data: [
        {"percent":{"1":0.8,"10":3.5,"15":5,"20":6},"restriction": {"element": [element]},"aura_type":"omega","stat":"da"},
        {"percent":{"1":0.8,"10":3.5,"15":5,"20":6},"restriction": {"element": [element]},"aura_type":"omega","stat":"ta"},
      ]
    },
    {
      name: name + '\'s Progression III',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: keyid,
    },
    {
      name: name + '\'s Celere II',
      icon: 'ws_skill_moment_m_' + elemid + '.png',
      desc: 'Chain of Temperament',
      level: 1,
      keyid: keyid,
      data: [
        {"percent":{"1":3,"10":12,"15":14.5,"20":16},"restriction":{"element":[element]},"aura_type":"omega","stat":"atk"},
        {"percent":{"1":3.2,"10":5,"15":6.5,"20":7.5},"restriction":{"element":[element]},"aura_type":"omega","stat":"crit"}
      ]
    },
    {
      name: name + '\'s Majesty II',
      icon: 'ws_skill_god_m_' + elemid + '_2.png',
      desc: 'Chain of Restoration',
      level: 1,
      keyid: keyid,
      data: [
        {"percent":{"1":3,"10":12,"15":14.5,"20":15.5},"restriction":{"element":[element]},"aura_type":"omega","stat":"atk"},
        {"percent":{"1":3,"10":12,"15":14.5,"20":15.5},"restriction":{"element":[element]},"aura_type":"omega","stat":"hp"}
      ]
    },
    {
      name: name + '\'s Glory III',
      icon: 'ws_skill_hero_m_' + elemid + '_3.png',
      desc: 'Chain of Glorification',
      level: 1,
      keyid: keyid,
    },
    {
      name: 'Cunning Temptation',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Chain of Temptation',
      level: 1,
      keyid: keyid,
    },
    {
      name: 'Forbidden Fruit',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Chain of Forbiddance',
      level: 1,
      keyid: keyid,
    },
    {
      name: 'Wicked Conduct',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Chain of Depravity',
      level: 1,
      keyid: keyid,
    },
    {
      name: 'Deceitful Fallacy',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Chain of Falsehood',
      level: 1,
      keyid: keyid,
    },
  ]
}

function getOpusThirdOptimus(name1, name2, keyid, element) {
  const elemid = keyid - 30;
  return [
    {
      name: name1 + '\'s Stamina',
      icon: 'ws_skill_whole_' + elemid + '_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: keyid,
      data: [ {"percent": {"1": 56.4}, "aura_type": "optimus", "stat": "stamina", "restriction": {"element": [element] }} ]
    },
    {
      name: name1 + '\'s Enmity',
      icon: 'ws_skill_backwater_' + elemid + '_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: keyid,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": [element]}, "aura_type": "optimus", "stat": "enmity"} ]
    },
    {
      name: name2 + '\'s Trium',
      icon: 'ws_skill_ta_' + elemid + '_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: keyid,
      data: [
        {"percent":{"1":0.8,"10":3.5,"15":5,"20":6},"restriction": {"element": [element]},"aura_type":"optimus","stat":"da"},
        {"percent":{"1":0.8,"10":3.5,"15":5,"20":6},"restriction": {"element": [element]},"aura_type":"optimus","stat":"ta"},
      ]
    },
    {
      name: name1 + '\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: keyid,
    },
    {
      name: name2 + '\'s Celere',
      icon: 'ws_skill_moment_' + elemid + '.png',
      desc: 'Chain of Temperament',
      level: 1,
      keyid: keyid,
      data: [
        {"percent":{"1":3,"10":12,"15":14.5,"20":16},"restriction":{"element":[element]},"aura_type":"optimus","stat":"atk"},
        {"percent":{"1":3.2,"10":5,"15":6.5,"20":7.5},"restriction":{"element":[element]},"aura_type":"optimus","stat":"crit"}
      ]
    },
    {
      name: name2 + '\'s Majesty',
      icon: 'ws_skill_god_' + elemid + '_2.png',
      desc: 'Chain of Restoration',
      level: 1,
      keyid: keyid,
      data: [
        {"percent":{"1":3,"10":12,"15":14.5,"20":15.5},"restriction":{"element":[element]},"aura_type":"optimus","stat":"atk"},
        {"percent":{"1":3,"10":12,"15":14.5,"20":15.5},"restriction":{"element":[element]},"aura_type":"optimus","stat":"hp"}
      ]
    },
    {
      name: name1 + '\'s Glory',
      icon: 'ws_skill_hero_' + elemid + '_3.png',
      desc: 'Chain of Glorification',
      level: 1,
      keyid: keyid,
    },
    {
      name: 'Cunning Temptation',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Chain of Temptation',
      level: 1,
      keyid: keyid,
    },
    {
      name: 'Forbidden Fruit',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Chain of Forbiddance',
      level: 1,
      keyid: keyid,
    },
    {
      name: 'Wicked Conduct',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Chain of Depravity',
      level: 1,
      keyid: keyid,
    },
    {
      name: 'Deceitful Fallacy',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Chain of Falsehood',
      level: 1,
      keyid: keyid,
    },
  ];
}

// Data

const data = {
  // Atma keys
  1: getAtmaWeapon('Gladius', 1, 'sabre'),
  2: getAtmaWeapon('Sica', 2, 'dagger'),
  3: getAtmaWeapon('Lancea', 3, 'spear'),
  4: getAtmaWeapon('Labrys', 4, 'axe'),
  5: getAtmaWeapon('Baculum', 5, 'staff'),
  6: getAtmaWeapon('Arma', 6, 'gun'),
  7: getAtmaWeapon('Luctor', 7, 'melee'),
  8: getAtmaWeapon('Arcus', 8, 'bow'),
  9: getAtmaWeapon('Musica', 9, 'harp'),
  10: getAtmaWeapon('Makhaira', 10, 'katana'),
  // Ultima keys
  11: [
    {
      name: 'Scandere Aggressio',
      icon: 'ws_skill_normal_limit.png',
      desc: 'Gauph Key α',
      level: 1,
      keyid: 11,
      data: [ { "percent": {"1": 10}, "aura_type": "normal", "stat": "atk_cap" } ],
    },
    {
      name: 'Scandere Facultas',
      icon: 'ws_skill_ability_limit.png',
      desc: 'Gauph Key β',
      level: 1,
      keyid: 11,
    },
    {
      name: 'Scandere Arcanum',
      icon: 'ws_skill_special_limit.png',
      desc: 'Gauph Key γ',
      level: 1,
      keyid: 11,
      data: [ { "percent": {"1": 15}, "aura_type": "normal", "stat": "ca_cap" } ],
    },
    {
      name: 'Scandere Catena',
      icon: 'ws_skill_chain_limit.png',
      desc: 'Gauph Key Δ',
      level: 1,
      keyid: 11,
      data: [ { "percent": {"1": 50}, "aura_type": "normal", "stat": "chainburst_cap" } ],
    },
  ],
  // Dark Opus 2nd key
  12: [
    {
      name: 'α Revelation',
      icon: 'ws_skill_normal_limit.png',
      desc: 'Gauph Key α',
      level: 1,
      keyid: 12,
      data: [ { "percent": {"1": 10}, "aura_type": "normal", "stat": "atk_cap" } ],
    },
    {
      name: 'β Revelation',
      icon: 'ws_skill_ability_limit.png',
      desc: 'Gauph Key β',
      level: 1,
      keyid: 12,
    },
    {
      name: 'γ Revelation',
      icon: 'ws_skill_special_limit.png',
      desc: 'Gauph Key γ',
      level: 1,
      keyid: 12,
      data: [ { "percent": {"1": 15}, "aura_type": "normal", "stat": "ca_cap" } ],
    },
    {
      name: 'Δ Revelation',
      icon: 'ws_skill_chain_limit.png',
      desc: 'Gauph Key Δ',
      level: 1,
      keyid: 12,
      data: [ { "percent": {"1": 50}, "aura_type": "normal", "stat": "chainburst_cap" } ],
    },
  ],
  // Dark Opus 3rd keys Omega
  21: getOpusThirdOmega('Ironflame', 21, 'fire'),
  22: getOpusThirdOmega('Oceansoul', 22, 'water'),
  23: getOpusThirdOmega('Lifetree', 23, 'earth'),
  24: getOpusThirdOmega('Stormwyrm', 24, 'wind'),
  25: getOpusThirdOmega('Knightcode', 25, 'light'),
  26: getOpusThirdOmega('Mistfall', 26, 'dark'),
  // Dark Opus 3rd keys Normal
  31: getOpusThirdOptimus('Inferno', 'Hellfire', 31, 'fire'),
  32: getOpusThirdOptimus('Hoarfrost', 'Tsunami', 32, 'water'),
  33: getOpusThirdOptimus('Terra', 'Mountain', 33, 'earth'),
  34: getOpusThirdOptimus('Ventosus', 'Whirlwind', 34, 'wind'),
  35: getOpusThirdOptimus('Zion', 'Thunder', 35, 'light'),
  36: getOpusThirdOptimus('Oblivion', 'Hatred', 36, 'dark'),
  // Draconic 2nd skill
  40: [
    {
      name: 'True Dragon Barrier',
      icon: 'skill_damage_red_0.png',
      desc: 'Endurance Teluma',
      level: 150,
      keyid: 40,
    },
    {
      name: 'Vermillion Barrier',
      icon: 'ws_skill_damage_red_1.png',
      desc: 'Inferno Teluma',
      level: 150,
      keyid: 40,
    },
    {
      name: 'Azure Barrier',
      icon: 'ws_skill_damage_red_2.png',
      desc: 'Abyss Teluma',
      level: 150,
      keyid: 40,
    },
    {
      name: 'Golden Barrier',
      icon: 'ws_skill_damage_red_3.png',
      desc: 'Crag Teluma',
      level: 150,
      keyid: 40,
    },
    {
      name: 'Emerald Barrier',
      icon: 'ws_skill_damage_red_4.png',
      desc: 'Tempest Teluma',
      level: 150,
      keyid: 40,
    },
    {
      name: 'White Barrier',
      icon: 'ws_skill_damage_red_5.png',
      desc: 'Aureole Teluma',
      level: 150,
      keyid: 40,
    },
    {
      name: 'Black Barrier',
      icon: 'ws_skill_damage_red_6.png',
      desc: 'Malice Teluma',
      level: 150,
      keyid: 40,
    },
  ],
  // Draconic 3rd skill
  41: [
    {
      name: 'Inferno\'s Majesty',
      icon: 'ws_skill_god_1_3.png',
      desc: 'Optimus Teluma',
      level: 200,
      keyid: 41,
    },
    {
      name: 'Ironflame\'s Majesty III',
      icon: 'ws_skill_god_m_1_3.png',
      desc: 'Omega Teluma',
      level: 200,
      keyid: 41,
    },
  ],
  42: [
    {
      name: 'Hoarfrost\'s Majesty',
      icon: 'ws_skill_god_2_3.png',
      desc: 'Optimus Teluma',
      level: 200,
      keyid: 42,
    },
    {
      name: 'Oceansoul\'s Majesty III',
      icon: 'ws_skill_god_m_2_3.png',
      desc: 'Omega Teluma',
      level: 200,
      keyid: 42,
    },
  ],
  43: [
    {
      name: 'Terra\'s Majesty',
      icon: 'ws_skill_god_3_3.png',
      desc: 'Optimus Teluma',
      level: 200,
      keyid: 43,
    },
    {
      name: 'Lifetree\'s Majesty III',
      icon: 'ws_skill_god_m_3_3.png',
      desc: 'Omega Teluma',
      level: 200,
      keyid: 43,
    },
  ],
  44: [
    {
      name: 'Ventosus\'s Majesty',
      icon: 'ws_skill_god_4_3.png',
      desc: 'Optimus Teluma',
      level: 200,
      keyid: 44,
    },
    {
      name: 'Stormwyrm\'s Majesty III',
      icon: 'ws_skill_god_m_4_3.png',
      desc: 'Omega Teluma',
      level: 200,
      keyid: 44,
    },
  ],
  45: [
    {
      name: 'Zion\'s Majesty',
      icon: 'ws_skill_god_5_3.png',
      desc: 'Optimus Teluma',
      level: 200,
      keyid: 45,
    },
    {
      name: 'Knightcode\'s Majesty III',
      icon: 'ws_skill_god_m_5_3.png',
      desc: 'Omega Teluma',
      level: 200,
      keyid: 45,
    },
  ],
  46: [
    {
      name: 'Oblivion\'s Majesty',
      icon: 'ws_skill_god_6_3.png',
      desc: 'Optimus Teluma',
      level: 200,
      keyid: 46,
    },
    {
      name: 'Mistfall\'s Majesty III',
      icon: 'ws_skill_god_m_6_3.png',
      desc: 'Omega Teluma',
      level: 200,
      keyid: 46,
    },
  ],
  // Ultima 3rd skill
  50: [
    {
      name: 'Fulgor Fortis',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Gauph Key Ena',
      level: 200,
      keyid: 50,
    },
    {
      name: 'Fulgor Sanatio',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Gauph Key Dio',
      level: 200,
      keyid: 50,
    },
    {
      name: 'Fulgor Impetus',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Gauph Key Tria',
      level: 200,
      keyid: 50,
    },
    {
      name: 'Fulgor Elatio',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Gauph Key Tessera',
      level: 200,
      keyid: 50,
    },
  ],
}

export default {
  data,
  getSkillByName
}
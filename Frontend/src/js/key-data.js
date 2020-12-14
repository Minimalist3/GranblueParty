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

const data = {
  // Atma keys
  1: [ // sabre
    {
      name: 'Gladius Dominion',
      icon: 'ws_skill_weapon_atk_1.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: 1,
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Gladius Parity',
      icon: 'ws_skill_weapon_da_1.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: 1,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "hp" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "da" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "ta" },
      ],
    },
    {
      name: 'Gladius Utopia',
      icon: 'ws_skill_weapon_hp_1.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: 1,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Gladius Plenum',
      icon: 'ws_skill_weapon_whole_1.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: 1,
    },
    {
      name: 'Gladius Ultio',
      icon: 'ws_skill_weapon_backwater_1.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: 1,
    },
    {
      name: 'Gladius Ars',
      icon: 'ws_skill_weapon_tech_1.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: 1,
    },
  ],
  2: [ // dagger
    {
      name: 'Sica Dominion',
      icon: 'ws_skill_weapon_atk_2.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: 2,
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Sica Parity',
      icon: 'ws_skill_weapon_da_2.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: 2,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "hp" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "da" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "ta" },
      ],
    },
    {
      name: 'Sica Utopia',
      icon: 'ws_skill_weapon_hp_2.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: 2,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Sica Plenum',
      icon: 'ws_skill_weapon_whole_2.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: 2,
    },
    {
      name: 'Sica Ultio',
      icon: 'ws_skill_weapon_backwater_2.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: 2,
    },
    {
      name: 'Sica Ars',
      icon: 'ws_skill_weapon_tech_2.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: 2,
    },
  ],
  3: [ // spear
    {
      name: 'Lancea Dominion',
      icon: 'ws_skill_weapon_atk_3.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: 3,
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Lancea Parity',
      icon: 'ws_skill_weapon_da_3.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: 3,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "hp" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "da" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "ta" },
      ],
    },
    {
      name: 'Lancea Utopia',
      icon: 'ws_skill_weapon_hp_3.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: 3,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Lancea Plenum',
      icon: 'ws_skill_weapon_whole_3.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: 3,
    },
    {
      name: 'Lancea Ultio',
      icon: 'ws_skill_weapon_backwater_3.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: 3,
    },
    {
      name: 'Lancea Ars',
      icon: 'ws_skill_weapon_tech_3.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: 3,
    },
  ],
  4: [ // axe
    {
      name: 'Labrys Dominion',
      icon: 'ws_skill_weapon_atk_4.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: 4,
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Labrys Parity',
      icon: 'ws_skill_weapon_da_4.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: 4,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "hp" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "da" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "ta" },
      ],
    },
    {
      name: 'Labrys Utopia',
      icon: 'ws_skill_weapon_hp_4.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: 4,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Labrys Plenum',
      icon: 'ws_skill_weapon_whole_4.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: 4,
    },
    {
      name: 'Labrys Ultio',
      icon: 'ws_skill_weapon_backwater_4.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: 4,
    },
    {
      name: 'Labrys Ars',
      icon: 'ws_skill_weapon_tech_4.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: 4,
    },
  ],
  5: [ // staff
    {
      name: 'Baculum Dominion',
      icon: 'ws_skill_weapon_atk_5.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: 5,
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Baculum Parity',
      icon: 'ws_skill_weapon_da_5.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: 5,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "hp" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "da" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "ta" },
      ],
    },
    {
      name: 'Baculum Utopia',
      icon: 'ws_skill_weapon_hp_5.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: 5,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Baculum Plenum',
      icon: 'ws_skill_weapon_whole_5.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: 5,
    },
    {
      name: 'Baculum Ultio',
      icon: 'ws_skill_weapon_backwater_5.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: 5,
    },
    {
      name: 'Baculum Ars',
      icon: 'ws_skill_weapon_tech_5.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: 5,
    },
  ],
  6: [ // gun
    {
      name: 'Arma Dominion',
      icon: 'ws_skill_weapon_atk_6.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: 6,
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Arma Parity',
      icon: 'ws_skill_weapon_da_6.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: 6,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "hp" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "da" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "ta" },
      ],
    },
    {
      name: 'Arma Utopia',
      icon: 'ws_skill_weapon_hp_6.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: 6,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Arma Plenum',
      icon: 'ws_skill_weapon_whole_6.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: 6,
    },
    {
      name: 'Arma Ultio',
      icon: 'ws_skill_weapon_backwater_6.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: 6,
    },
    {
      name: 'Arma Ars',
      icon: 'ws_skill_weapon_tech_6.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: 6,
    },
  ],
  7: [ // melee
    {
      name: 'Luctor Dominion',
      icon: 'ws_skill_weapon_atk_7.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: 7,
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Luctor Parity',
      icon: 'ws_skill_weapon_da_7.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: 7,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "hp" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "da" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "ta" },
      ],
    },
    {
      name: 'Luctor Utopia',
      icon: 'ws_skill_weapon_hp_7.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: 7,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Luctor Plenum',
      icon: 'ws_skill_weapon_whole_7.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: 7,
    },
    {
      name: 'Luctor Ultio',
      icon: 'ws_skill_weapon_backwater_7.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: 7,
    },
    {
      name: 'Luctor Ars',
      icon: 'ws_skill_weapon_tech_7.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: 7,
    },
  ],
  8: [ // bow
    {
      name: 'Arcus Dominion',
      icon: 'ws_skill_weapon_atk_8.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: 8,
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Arcus Parity',
      icon: 'ws_skill_weapon_da_8.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: 8,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "hp" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "da" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "ta" },
      ],
    },
    {
      name: 'Arcus Utopia',
      icon: 'ws_skill_weapon_hp_8.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: 8,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Arcus Plenum',
      icon: 'ws_skill_weapon_whole_8.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: 8,
    },
    {
      name: 'Arcus Ultio',
      icon: 'ws_skill_weapon_backwater_8.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: 8,
    },
    {
      name: 'Arcus Ars',
      icon: 'ws_skill_weapon_tech_8.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: 8,
    },
  ],
  9: [ // harp
    {
      name: 'Musica Dominion',
      icon: 'ws_skill_weapon_atk_9.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: 9,
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Musica Parity',
      icon: 'ws_skill_weapon_da_9.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: 9,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "hp" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "da" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "ta" },
      ],
    },
    {
      name: 'Musica Utopia',
      icon: 'ws_skill_weapon_hp_9.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: 9,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Musica Plenum',
      icon: 'ws_skill_weapon_whole_9.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: 9,
    },
    {
      name: 'Musica Ultio',
      icon: 'ws_skill_weapon_backwater_9.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: 9,
    },
    {
      name: 'Musica Ars',
      icon: 'ws_skill_weapon_tech_9.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: 9,
    },
  ],
  10: [ // katana
    {
      name: 'Makhaira Dominion',
      icon: 'ws_skill_weapon_atk_10.png',
      desc: 'Gauph Key of Will',
      level: 1,
      keyid: 10,
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Makhaira Parity',
      icon: 'ws_skill_weapon_da_10.png',
      desc: 'Gauph Key of Strife',
      level: 1,
      keyid: 10,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "hp" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "da" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "ta" },
      ]
    },
    {
      name: 'Makhaira Utopia',
      icon: 'ws_skill_weapon_hp_10.png',
      desc: 'Gauph Key of Vitality',
      level: 1,
      keyid: 10,
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Makhaira Plenum',
      icon: 'ws_skill_weapon_whole_10.png',
      desc: 'Gauph Key of Strength',
      level: 1,
      keyid: 10,
    },
    {
      name: 'Makhaira Ultio',
      icon: 'ws_skill_weapon_backwater_10.png',
      desc: 'Gauph Key of Zeal',
      level: 1,
      keyid: 10,
    },
    {
      name: 'Makhaira Ars',
      icon: 'ws_skill_weapon_tech_10.png',
      desc: 'Gauph Key of Courage',
      level: 1,
      keyid: 10,
    },
  ],
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
  21: [
    {
      name: 'Ironflame\'s Stamina II',
      icon: 'ws_skill_whole_m_1_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 21,
      data: [ {"percent": {"1": 56.4}, "aura_type": "omega", "stat": "stamina", "restriction": {"element": ["fire"] }} ]
    },
    {
      name: 'Ironflame\'s Enmity III',
      icon: 'ws_skill_backwater_m_1_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 21,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["fire"]}, "aura_type": "omega", "stat": "enmity"} ]
    },
    {
      name: 'Ironflame\'s Trium II',
      icon: 'ws_skill_ta_m_1_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 21,
    },
    {
      name: 'Ironflame\'s Progression III',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 21,
    },
  ],
  22: [
    {
      name: 'Oceansoul\'s Stamina II',
      icon: 'ws_skill_whole_m_2_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 22,
      data: [ {"percent": {"1": 56.4}, "aura_type": "omega", "stat": "stamina", "restriction": {"element": ["water"] }} ]
    },
    {
      name: 'Oceansoul\'s Enmity III',
      icon: 'ws_skill_backwater_m_2_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 22,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["water"]}, "aura_type": "omega", "stat": "enmity"} ]
    },
    {
      name: 'Oceansoul\'s Trium II',
      icon: 'ws_skill_ta_m_2_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 22,
    },
    {
      name: 'Oceansoul\'s Progression III',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 22,
    },
  ],
  23: [
    {
      name: 'Lifetree\'s Stamina II',
      icon: 'ws_skill_whole_m_3_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 23,
      data: [ {"percent": {"1": 56.4}, "aura_type": "omega", "stat": "stamina", "restriction": {"element": ["earth"] }} ]
    },
    {
      name: 'Lifetree\'s Enmity III',
      icon: 'ws_skill_backwater_m_3_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 23,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["earth"]}, "aura_type": "omega", "stat": "enmity"} ]
    },
    {
      name: 'Lifetree\'s Trium II',
      icon: 'ws_skill_ta_m_3_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 23,
    },
    {
      name: 'Lifetree\'s Progression III',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 23,
    },
  ],
  24: [
    {
      name: 'Stormwyrm\'s Stamina II',
      icon: 'ws_skill_whole_m_4_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 24,
      data: [ {"percent": {"1": 56.4}, "aura_type": "omega", "stat": "stamina", "restriction": {"element": ["wind"] }} ]
    },
    {
      name: 'Stormwyrm\'s Enmity III',
      icon: 'ws_skill_backwater_m_4_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 24,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["wind"]}, "aura_type": "omega", "stat": "enmity"} ]
    },
    {
      name: 'Stormwyrm\'s Trium II',
      icon: 'ws_skill_ta_m_4_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 24,
    },
    {
      name: 'Stormwyrm\'s Progression III',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 24,
    },
  ],
  25: [
    {
      name: 'Knightcode\'s Stamina II',
      icon: 'ws_skill_whole_m_5_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 25,
      data: [ {"percent": {"1": 56.4}, "aura_type": "omega", "stat": "stamina", "restriction": {"element": ["light"] }} ]
    },
    {
      name: 'Knightcode\'s Enmity III',
      icon: 'ws_skill_backwater_m_5_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 25,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["light"]}, "aura_type": "omega", "stat": "enmity"} ]
    },
    {
      name: 'Knightcode\'s Trium II',
      icon: 'ws_skill_ta_m_5_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 25,
    },
    {
      name: 'Knightcode\'s Progression III',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 25,
    },
  ],
  26: [
    {
      name: 'Mistfall\'s Stamina II',
      icon: 'ws_skill_whole_m_6_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 26,
      data: [ {"percent": {"1": 56.4}, "aura_type": "omega", "stat": "stamina", "restriction": {"element": ["dark"] }} ]
    },
    {
      name: 'Mistfall\'s Enmity III',
      icon: 'ws_skill_backwater_m_6_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 26,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["dark"]}, "aura_type": "omega", "stat": "enmity"} ]
    },
    {
      name: 'Mistfall\'s Trium II',
      icon: 'ws_skill_ta_m_6_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 26,
    },
    {
      name: 'Mistfall\'s Progression III',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 26,
    },
  ],
  // Dark Opus 3rd keys Normal
  31: [
    {
      name: 'Inferno\'s Stamina',
      icon: 'ws_skill_whole_1_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 31,
      data: [ {"percent": {"1": 56.4}, "aura_type": "optimus", "stat": "stamina", "restriction": {"element": ["fire"] }} ]
    },
    {
      name: 'Inferno\'s Enmity',
      icon: 'ws_skill_backwater_1_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 31,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["fire"]}, "aura_type": "optimus", "stat": "enmity"} ]
    },
    {
      name: 'Hellfire\'s Trium',
      icon: 'ws_skill_ta_1_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 31,
    },
    {
      name: 'Inferno\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 31,
    },
  ],
  32: [
    {
      name: 'Hoarfrost\'s Stamina',
      icon: 'ws_skill_whole_2_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 32,
      data: [ {"percent": {"1": 56.4}, "aura_type": "optimus", "stat": "stamina", "restriction": {"element": ["water"] }} ]
    },
    {
      name: 'Hoarfrost\'s Enmity',
      icon: 'ws_skill_backwater_2_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 32,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["water"]}, "aura_type": "optimus", "stat": "enmity"} ]
    },
    {
      name: 'Tsunami\'s Trium',
      icon: 'ws_skill_ta_2_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 32,
    },
    {
      name: 'Hoarfrost\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 32,
    },
  ],
  33: [
    {
      name: 'Terra\'s Stamina',
      icon: 'ws_skill_whole_3_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 33,
      data: [ {"percent": {"1": 56.4}, "aura_type": "optimus", "stat": "stamina", "restriction": {"element": ["earth"] }} ]
    },
    {
      name: 'Terra\'s Enmity',
      icon: 'ws_skill_backwater_3_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 33,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["earth"]}, "aura_type": "optimus", "stat": "enmity"} ]
    },
    {
      name: 'Mountain\'s Trium',
      icon: 'ws_skill_ta_3_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 33,
    },
    {
      name: 'Terra\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 33,
    },
  ],
  34: [
    {
      name: 'Ventosus\'s Stamina',
      icon: 'ws_skill_whole_4_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 34,
      data: [ {"percent": {"1": 56.4}, "aura_type": "optimus", "stat": "stamina", "restriction": {"element": ["wind"] }} ]
    },
    {
      name: 'Ventosus\'s Enmity',
      icon: 'ws_skill_backwater_4_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 34,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["wind"]}, "aura_type": "optimus", "stat": "enmity"} ]
    },
    {
      name: 'Whirlwind\'s Trium',
      icon: 'ws_skill_ta_4_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 34,
    },
    {
      name: 'Ventosus\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 34,
    },
  ],
  35: [
    {
      name: 'Zion\'s Stamina',
      icon: 'ws_skill_whole_5_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 35,
      data: [ {"percent": {"1": 56.4}, "aura_type": "optimus", "stat": "stamina", "restriction": {"element": ["light"] }} ]
    },
    {
      name: 'Zion\'s Enmity',
      icon: 'ws_skill_backwater_5_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 35,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["light"]}, "aura_type": "optimus", "stat": "enmity"} ]
    },
    {
      name: 'Thunder\'s Trium',
      icon: 'ws_skill_ta_5_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 35,
    },
    {
      name: 'Zion\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 35,
    },
  ],
  36: [
    {
      name: 'Oblivion\'s Stamina',
      icon: 'ws_skill_whole_6_3.png',
      desc: 'Pendulum of Strength',
      level: 1,
      keyid: 36,
      data: [ {"percent": {"1": 56.4}, "aura_type": "optimus", "stat": "stamina", "restriction": {"element": ["dark"] }} ]
    },
    {
      name: 'Oblivion\'s Enmity',
      icon: 'ws_skill_backwater_6_3.png',
      desc: 'Pendulum of Zeal',
      level: 1,
      keyid: 36,
      data: [ {"percent": {"1":0.83,"10":10,"15":12.5,"20":13.5}, "restriction": {"element": ["dark"]}, "aura_type": "optimus", "stat": "enmity"} ]
    },
    {
      name: 'Hatred\'s Trium',
      icon: 'ws_skill_ta_6_2.png',
      desc: 'Pendulum of Strife',
      level: 1,
      keyid: 36,
    },
    {
      name: 'Oblivion\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
      level: 1,
      keyid: 36,
    },
  ],
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
}

export default {
  data,
  getSkillByName
}
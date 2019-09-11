const getSkillByName = (name) => {
  for (let [keyid, keys] of Object.entries(data)) {
    for (let entry of keys) {
      if (name === entry.name) {
        entry['level'] = 1;
        entry['keyid'] = keyid;
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
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Gladius Parity',
      icon: 'ws_skill_weapon_da_1.png',
      desc: 'Gauph Key of Strife',
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
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["sabre"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Gladius Plenum',
      icon: 'ws_skill_weapon_whole_1.png',
      desc: 'Gauph Key of Strength',
    },
    {
      name: 'Gladius Ultio',
      icon: 'ws_skill_weapon_backwater_1.png',
      desc: 'Gauph Key of Zeal',
    },
    {
      name: 'Gladius Ars',
      icon: 'ws_skill_weapon_tech_1.png',
      desc: 'Gauph Key of Courage',
    },
  ],
  2: [ // dagger
    {
      name: 'Sica Dominion',
      icon: 'ws_skill_weapon_atk_2.png',
      desc: 'Gauph Key of Will',
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Sica Parity',
      icon: 'ws_skill_weapon_da_2.png',
      desc: 'Gauph Key of Strife',
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
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["dagger"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Sica Plenum',
      icon: 'ws_skill_weapon_whole_2.png',
      desc: 'Gauph Key of Strength',
    },
    {
      name: 'Sica Ultio',
      icon: 'ws_skill_weapon_backwater_2.png',
      desc: 'Gauph Key of Zeal',
    },
    {
      name: 'Sica Ars',
      icon: 'ws_skill_weapon_tech_2.png',
      desc: 'Gauph Key of Courage',
    },
  ],
  3: [ // spear
    {
      name: 'Lancea Dominion',
      icon: 'ws_skill_weapon_atk_3.png',
      desc: 'Gauph Key of Will',
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Lancea Parity',
      icon: 'ws_skill_weapon_da_3.png',
      desc: 'Gauph Key of Strife',
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
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["spear"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Lancea Plenum',
      icon: 'ws_skill_weapon_whole_3.png',
      desc: 'Gauph Key of Strength',
    },
    {
      name: 'Lancea Ultio',
      icon: 'ws_skill_weapon_backwater_3.png',
      desc: 'Gauph Key of Zeal',
    },
    {
      name: 'Lancea Ars',
      icon: 'ws_skill_weapon_tech_3.png',
      desc: 'Gauph Key of Courage',
    },
  ],
  4: [ // axe
    {
      name: 'Labrys Dominion',
      icon: 'ws_skill_weapon_atk_4.png',
      desc: 'Gauph Key of Will',
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Labrys Parity',
      icon: 'ws_skill_weapon_da_4.png',
      desc: 'Gauph Key of Strife',
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
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["axe"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Labrys Plenum',
      icon: 'ws_skill_weapon_whole_4.png',
      desc: 'Gauph Key of Strength',
    },
    {
      name: 'Labrys Ultio',
      icon: 'ws_skill_weapon_backwater_4.png',
      desc: 'Gauph Key of Zeal',
    },
    {
      name: 'Labrys Ars',
      icon: 'ws_skill_weapon_tech_4.png',
      desc: 'Gauph Key of Courage',
    },
  ],
  5: [ // staff
    {
      name: 'Baculum Dominion',
      icon: 'ws_skill_weapon_atk_5.png',
      desc: 'Gauph Key of Will',
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Baculum Parity',
      icon: 'ws_skill_weapon_da_5.png',
      desc: 'Gauph Key of Strife',
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
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["staff"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Baculum Plenum',
      icon: 'ws_skill_weapon_whole_5.png',
      desc: 'Gauph Key of Strength',
    },
    {
      name: 'Baculum Ultio',
      icon: 'ws_skill_weapon_backwater_5.png',
      desc: 'Gauph Key of Zeal',
    },
    {
      name: 'Baculum Ars',
      icon: 'ws_skill_weapon_tech_5.png',
      desc: 'Gauph Key of Courage',
    },
  ],
  6: [ // gun
    {
      name: 'Arma Dominion',
      icon: 'ws_skill_weapon_atk_6.png',
      desc: 'Gauph Key of Will',
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Arma Parity',
      icon: 'ws_skill_weapon_da_6.png',
      desc: 'Gauph Key of Strife',
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
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["gun"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Arma Plenum',
      icon: 'ws_skill_weapon_whole_6.png',
      desc: 'Gauph Key of Strength',
    },
    {
      name: 'Arma Ultio',
      icon: 'ws_skill_weapon_backwater_6.png',
      desc: 'Gauph Key of Zeal',
    },
    {
      name: 'Arma Ars',
      icon: 'ws_skill_weapon_tech_6.png',
      desc: 'Gauph Key of Courage',
    },
  ],
  7: [ // melee
    {
      name: 'Luctor Dominion',
      icon: 'ws_skill_weapon_atk_7.png',
      desc: 'Gauph Key of Will',
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Luctor Parity',
      icon: 'ws_skill_weapon_da_7.png',
      desc: 'Gauph Key of Strife',
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
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["melee"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Luctor Plenum',
      icon: 'ws_skill_weapon_whole_7.png',
      desc: 'Gauph Key of Strength',
    },
    {
      name: 'Luctor Ultio',
      icon: 'ws_skill_weapon_backwater_7.png',
      desc: 'Gauph Key of Zeal',
    },
    {
      name: 'Luctor Ars',
      icon: 'ws_skill_weapon_tech_7.png',
      desc: 'Gauph Key of Courage',
    },
  ],
  8: [ // bow
    {
      name: 'Arcus Dominion',
      icon: 'ws_skill_weapon_atk_8.png',
      desc: 'Gauph Key of Will',
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Arcus Parity',
      icon: 'ws_skill_weapon_da_8.png',
      desc: 'Gauph Key of Strife',
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
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["bow"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Arcus Plenum',
      icon: 'ws_skill_weapon_whole_8.png',
      desc: 'Gauph Key of Strength',
    },
    {
      name: 'Arcus Ultio',
      icon: 'ws_skill_weapon_backwater_8.png',
      desc: 'Gauph Key of Zeal',
    },
    {
      name: 'Arcus Ars',
      icon: 'ws_skill_weapon_tech_8.png',
      desc: 'Gauph Key of Courage',
    },
  ],
  9: [ // harp
    {
      name: 'Musica Dominion',
      icon: 'ws_skill_weapon_atk_9.png',
      desc: 'Gauph Key of Will',
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Musica Parity',
      icon: 'ws_skill_weapon_da_9.png',
      desc: 'Gauph Key of Strife',
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
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["harp"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Musica Plenum',
      icon: 'ws_skill_weapon_whole_9.png',
      desc: 'Gauph Key of Strength',
    },
    {
      name: 'Musica Ultio',
      icon: 'ws_skill_weapon_backwater_9.png',
      desc: 'Gauph Key of Zeal',
    },
    {
      name: 'Musica Ars',
      icon: 'ws_skill_weapon_tech_9.png',
      desc: 'Gauph Key of Courage',
    },
  ],
  10: [ // katana
    {
      name: 'Makhaira Dominion',
      icon: 'ws_skill_weapon_atk_10.png',
      desc: 'Gauph Key of Will',
      data: [
        { "percent": {"1": 3, "10": 30}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 1, "10": 10}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Makhaira Parity',
      icon: 'ws_skill_weapon_da_10.png',
      desc: 'Gauph Key of Strife',
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
      data: [
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "atk" },
        { "percent": {"1": 2, "10": 20}, "restriction": {"weapon": ["katana"]}, "aura_type": "normal", "stat": "hp" },
      ],
    },
    {
      name: 'Makhaira Plenum',
      icon: 'ws_skill_weapon_whole_10.png',
      desc: 'Gauph Key of Strength',
    },
    {
      name: 'Makhaira Ultio',
      icon: 'ws_skill_weapon_backwater_10.png',
      desc: 'Gauph Key of Zeal',
    },
    {
      name: 'Makhaira Ars',
      icon: 'ws_skill_weapon_tech_10.png',
      desc: 'Gauph Key of Courage',
    },
  ],
  // Ultima keys
  11: [
    {
      name: 'Scandere Aggressio',
      icon: 'ws_skill_normal_limit.png',
      desc: 'Gauph Key α',
      data: [ { "percent": {"1": 10}, "aura_type": "normal", "stat": "atk_cap" } ],
    },
    {
      name: 'Scandere Facultas',
      icon: 'ws_skill_ability_limit.png',
      desc: 'Gauph Key β',
    },
    {
      name: 'Scandere Arcanum',
      icon: 'ws_skill_special_limit.png',
      desc: 'Gauph Key γ',
      data: [ { "percent": {"1": 15}, "aura_type": "normal", "stat": "ca_cap" } ],
    },
    {
      name: 'Scandere Catena',
      icon: 'ws_skill_chain_limit.png',
      desc: 'Gauph Key Δ',
      data: [ { "percent": {"1": 50}, "aura_type": "normal", "stat": "chainburst_cap" } ],
    },
  ],
  // Dark Opus 2nd key
  12: [
    {
      name: 'α Revelation',
      icon: 'ws_skill_normal_limit.png',
      desc: 'Gauph Key α',
      data: [ { "percent": {"1": 10}, "aura_type": "normal", "stat": "atk_cap" } ],
    },
    {
      name: 'β Revelation',
      icon: 'ws_skill_ability_limit.png',
      desc: 'Gauph Key β',
    },
    {
      name: 'γ Revelation',
      icon: 'ws_skill_special_limit.png',
      desc: 'Gauph Key γ',
      data: [ { "percent": {"1": 15}, "aura_type": "normal", "stat": "ca_cap" } ],
    },
    {
      name: 'Δ Revelation',
      icon: 'ws_skill_chain_limit.png',
      desc: 'Gauph Key Δ',
      data: [ { "percent": {"1": 50}, "aura_type": "normal", "stat": "chainburst_cap" } ],
    },
  ],
  // Dark Opus 3rd keys Magna
  21: [
    {
      name: 'Vulcan\'s Stamina II',
      icon: 'ws_skill_whole_m_1_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Vulcan\'s Enmity II',
      icon: 'ws_skill_backwater_m_1_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Vulcan\'s Trium II',
      icon: 'ws_skill_ta_m_1_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Vulcan\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  22: [
    {
      name: 'Ezili\'s Stamina II',
      icon: 'ws_skill_whole_m_2_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Ezili\'s Enmity II',
      icon: 'ws_skill_backwater_m_2_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Ezili\'s Trium II',
      icon: 'ws_skill_ta_m_2_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Ezili\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  23: [
    {
      name: 'Gaia\'s Stamina II',
      icon: 'ws_skill_whole_m_3_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Gaia\'s Enmity II',
      icon: 'ws_skill_backwater_m_3_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Gaia\'s Trium II',
      icon: 'ws_skill_ta_m_3_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Gaia\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  24: [
    {
      name: 'Aeolus\'s Stamina II',
      icon: 'ws_skill_whole_m_4_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Aeolus\'s Enmity II',
      icon: 'ws_skill_backwater_m_4_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Aeolus\'s Trium II',
      icon: 'ws_skill_ta_m_4_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Aeolus\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  25: [
    {
      name: 'Horus\'s Stamina II',
      icon: 'ws_skill_whole_m_5_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Horus\'s Enmity II',
      icon: 'ws_skill_backwater_m_5_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Horus\'s Trium II',
      icon: 'ws_skill_ta_m_5_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Horus\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  26: [
    {
      name: 'Shalim\'s Stamina II',
      icon: 'ws_skill_whole_m_6_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Shalim\'s Enmity II',
      icon: 'ws_skill_backwater_m_6_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Shalim\'s Trium II',
      icon: 'ws_skill_ta_m_6_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Shalim\'s Progression',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  // Dark Opus 3rd keys Normal
  31: [
    {
      name: 'Inferno\'s Stamina',
      icon: 'ws_skill_whole_1_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Inferno\'s Enmity',
      icon: 'ws_skill_backwater_1_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Hellfire\'s Trium',
      icon: 'ws_skill_ta_1_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Inferno\'s skill',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  32: [
    {
      name: 'Hoarfrost\'s Stamina',
      icon: 'ws_skill_whole_2_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Hoarfrost\'s Enmity',
      icon: 'ws_skill_backwater_2_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Tsunami\'s Trium',
      icon: 'ws_skill_ta_2_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Hoarfrost\'s skill',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  33: [
    {
      name: 'Terra\'s Stamina',
      icon: 'ws_skill_whole_3_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Terra\'s Enmity',
      icon: 'ws_skill_backwater_3_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Mountain\'s Trium',
      icon: 'ws_skill_ta_3_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Terra\'s skill',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  34: [
    {
      name: 'Ventosus\'s Stamina',
      icon: 'ws_skill_whole_4_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Ventosus\'s Enmity',
      icon: 'ws_skill_backwater_4_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Whirlwind\'s Trium',
      icon: 'ws_skill_ta_4_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Ventosus\'s skill',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  35: [
    {
      name: 'Zion\'s Stamina',
      icon: 'ws_skill_whole_5_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Zion\'s Enmity',
      icon: 'ws_skill_backwater_5_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Thunder\'s Trium',
      icon: 'ws_skill_ta_5_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Zion\'s skill',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],
  36: [
    {
      name: 'Oblivion\'s Stamina',
      icon: 'ws_skill_whole_6_3.png',
      desc: 'Pendulum of Strength',
    },
    {
      name: 'Oblivion\'s Enmity',
      icon: 'ws_skill_backwater_6_3.png',
      desc: 'Pendulum of Zeal',
    },
    {
      name: 'Hatred\'s Trium',
      icon: 'ws_skill_ta_6_2.png',
      desc: 'Pendulum of Strife',
    },
    {
      name: 'Oblivion\'s skill',
      icon: 'ws_skill_job_weapon.png',
      desc: 'Pendulum of Prosperity',
    },
  ],  
}

export default {
  data,
  getSkillByName
}
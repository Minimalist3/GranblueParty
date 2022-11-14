from configparser import ConfigParser
import html

RARITIES = ['r', 'sr', 'ssr']
ELEMENTS = ['fire', 'wind', 'earth', 'water', 'light', 'dark', 'any']
CHARATYPES = ['attack', 'balanced', 'defense', 'heal', 'special']
RACES = ['human', 'draph', 'erune', 'harvin', 'primal', 'unknown']
WEAPONTYPES = ['axe', 'bow', 'dagger', 'gun', 'harp', 'katana', 'melee', 'sabre', 'spear', 'staff']
NEWSTYPES = ['update', 'change', 'fix', 'other']

# How to obtain each Character
OBTAIN = {
  'Eternal': 10,
  'Evoker': 20,
  '[[Classic Draw]]': 500,
  '[[Premium Draw]]': 1000,
  '[[Draw#Premium_Draw|Premium Draw]]': 1000,
  '[[Draw#Premium|Premium Draw]]': 1000,
  'Valentine Premium Draw': 1010,
  'Holiday Premium Draw': 1020,
  'Summer Premium Draw': 1030,
  'Halloween Premium Draw': 1040,
  'Zodiac Premium Draw': 1050,
  '[[Flash Gala]]': 1500,
  'Premium Gala': 1600,
}

CHARA_ETERNALS = {'3040030', '3040031', '3040032', '3040033', '3040034', '3040035', '3040036', '3040037', '3040038', '3040039'}

CHARA_EVOKERS = {'3040160', '3040161', '3040162', '3040163', '3040164', '3040165', '3040166', '3040167', '3040168', '3040169'}

SUMMON_EVOKERS = {'2040236', '2040237', '2040238', '2040239', '2040240', '2040241', '2040242', '2040243', '2040244', '2040245'}

CLASSES_ROWS = ['1', '2', '3', '4', '11', '12', '5']
CLASSES_ROWS_NAMES = ['1', '2', '3', '4', 'Ex1', 'Ex2', '5']

# Classes are a pain to scrape, let's hardcode the whole list
# /!\ Always add new classes at the END of the list /!\
# http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/leader/quest/*_xx_0_01.jpg
# In GBF Classes selection panel, see cnt-job-image > img-job, for xx value
CLASSES = [
  ('Fighter', 100001), ('Knight', 110001), ('Priest', 120001), ('Wizard', 130001), ('Thief', 140001), ('Enhancer', 150001), ('Grappler', 160001), ('Ranger', 170001), ('Harpist', 180001), ('Lancer', 190001),
	('Warrior', 100101), ('Sentinel', 110101), ('Cleric', 120101), ('Sorcerer', 130101), ('Raider', 140101), ('Arcana Dueler', 150101), ('Kung Fu Artist', 160101), ('Archer', 170101), ('Bard', 180101), ('Dragoon', 190101),
	('Weapon Master', 100201), ('Holy Saber', 110201), ('Bishop', 120201), ('Hermit', 130201), ('Hawkeye', 140201), ('Dark Fencer', 150201), ('Ogre', 160201), ('Sidewinder', 170201), ('Superstar', 180201), ('Valkyrie', 190201), ('Gladiator', 300201),
	('Berserker', 100301), ('Spartan', 110301), ('Sage', 120301), ('Warlock', 130301), ('Bandit Tycoon', 140301), ('Chaos Ruler', 150301), ('Luchador', 160301), ('Nighthound', 170301), ('Elysian', 180301), ('Apsaras', 190301), ('Chrysaor', 300301),
	('Alchemist', 200201), ('Ninja', 210201), ('Samurai', 220201), ('Sword Master', 230201), ('Gunslinger', 240201), ('Mystic', 250201), ('Assassin', 260201), ('Drum Master', 270201), ('Dancer', 280201), ('Mechanic', 290201),
	('Doctor', 200301), ('Runeslayer', 210301), ('Kengo', 220301), ('Glorybringer', 230301), ('Soldier', 240301), ('Nekomancer', 250301), ('Tormentor', 260301), ('Rising Force', 270301), ('Lumberjack', 410301), ('Cavalier', 420301),
  ('Monk', 430301), ('Robin Hood', 440301), ('Masquerade', 280301), ('Relic Buster', 450301),
  ('Viking', 100401), ('Paladin', 110401), ('Iatromantis', 120401)
]

IGNORE_MISSING_SKILL = {'3358', '3855', '3936', '4055', '4080', '4200', '4302'}
IGNORE_MISSING_WEAPON_STATS = {'10401085', '10401086', '10404097', '10406065', '10406066', '10408054',
  '10402140', '10402141', '10402142', '10402143', '10402144', '10402145',
  '10403120', '10403121', '10403122', '10403123', '10403124', '10403125',
  '10404172', '10404173', '10404174', '10404175', '10404176', '10404177',
  '10405126', '10405127', '10405128', '10405129', '10405130', '10405131', 
  '10406131', '10406132', '10406133', '10406134', '10406135', '10406136', 
  '10408121', '10408122', '10408123', '10408124', '10408125', '10408126',
  '10407100', '10407101', '10407102', '10407103', '10407104', '10407105', # Sherwood Bow
}
IGNORE_MISSING_AURA = {'96997', '21730', '33332', '33372'}

BOOST_TYPES = {'small', 'medium', 'big', 'massive', 'unworldly'}

WEAPONS_KEYS = {
  # Atma
  10400113: {1: 1}, 10400114: {1: 1}, 10400115: {1: 1}, 10400116: {1: 1}, 10400117: {1: 1}, 10400118: {1: 1}, 10401091: {1: 2}, 10401092: {1: 2}, 10401093: {1: 2}, 10401094: {1: 2}, 10401095: {1: 2}, 10401096: {1: 2}, 10402082: {1: 3}, 10402083: {1: 3}, 10402084: {1: 3}, 10402085: {1: 3}, 10402086: {1: 3}, 10402087: {1: 3}, 10403072: {1: 4}, 10403073: {1: 4}, 10403074: {1: 4}, 10403075: {1: 4}, 10403076: {1: 4}, 10403077: {1: 4}, 10404102: {1: 5}, 10404103: {1: 5}, 10404104: {1: 5}, 10404105: {1: 5}, 10404106: {1: 5}, 10404107: {1: 5}, 10405068: {1: 6}, 10405069: {1: 6}, 10405070: {1: 6}, 10405071: {1: 6}, 10405072: {1: 6}, 10405073: {1: 6}, 10406075: {1: 7}, 10406076: {1: 7}, 10406077: {1: 7}, 10406078: {1: 7}, 10406079: {1: 7}, 10406080: {1: 7}, 10407063: {1: 8}, 10407064: {1: 8}, 10407065: {1: 8}, 10407066: {1: 8}, 10407067: {1: 8}, 10407068: {1: 8}, 10408064: {1: 9}, 10408065: {1: 9}, 10408066: {1: 9}, 10408067: {1: 9}, 10408068: {1: 9}, 10408069: {1: 9}, 10409069: {1: 10}, 10409070: {1: 10}, 10409071: {1: 10}, 10409072: {1: 10}, 10409073: {1: 10}, 10409074: {1: 10},
  # Ultima
  10400119: {1: 1, 2: 11, 3: 50}, 10400120: {1: 1, 2: 11, 3: 50}, 10400121: {1: 1, 2: 11, 3: 50}, 10400122: {1: 1, 2: 11, 3: 50}, 10400123: {1: 1, 2: 11, 3: 50}, 10400124: {1: 1, 2: 11, 3: 50}, 10401097: {1: 2, 2: 11, 3: 50}, 10401098: {1: 2, 2: 11, 3: 50}, 10401099: {1: 2, 2: 11, 3: 50}, 10401100: {1: 2, 2: 11, 3: 50}, 10401101: {1: 2, 2: 11, 3: 50}, 10401102: {1: 2, 2: 11, 3: 50}, 10402088: {1: 3, 2: 11, 3: 50}, 10402089: {1: 3, 2: 11, 3: 50}, 10402090: {1: 3, 2: 11, 3: 50}, 10402091: {1: 3, 2: 11, 3: 50}, 10402092: {1: 3, 2: 11, 3: 50}, 10402093: {1: 3, 2: 11, 3: 50}, 10403078: {1: 4, 2: 11, 3: 50}, 10403079: {1: 4, 2: 11, 3: 50}, 10403080: {1: 4, 2: 11, 3: 50}, 10403081: {1: 4, 2: 11, 3: 50}, 10403082: {1: 4, 2: 11, 3: 50}, 10403083: {1: 4, 2: 11, 3: 50}, 10404108: {1: 5, 2: 11, 3: 50}, 10404109: {1: 5, 2: 11, 3: 50}, 10404110: {1: 5, 2: 11, 3: 50}, 10404111: {1: 5, 2: 11, 3: 50}, 10404112: {1: 5, 2: 11, 3: 50}, 10404113: {1: 5, 2: 11, 3: 50}, 10405074: {1: 6, 2: 11, 3: 50}, 10405075: {1: 6, 2: 11, 3: 50}, 10405076: {1: 6, 2: 11, 3: 50}, 10405077: {1: 6, 2: 11, 3: 50}, 10405078: {1: 6, 2: 11, 3: 50}, 10405079: {1: 6, 2: 11, 3: 50}, 10406081: {1: 7, 2: 11, 3: 50}, 10406082: {1: 7, 2: 11, 3: 50}, 10406083: {1: 7, 2: 11, 3: 50}, 10406084: {1: 7, 2: 11, 3: 50}, 10406085: {1: 7, 2: 11, 3: 50}, 10406086: {1: 7, 2: 11, 3: 50}, 10407069: {1: 8, 2: 11, 3: 50}, 10407070: {1: 8, 2: 11, 3: 50}, 10407071: {1: 8, 2: 11, 3: 50}, 10407072: {1: 8, 2: 11, 3: 50}, 10407073: {1: 8, 2: 11, 3: 50}, 10407074: {1: 8, 2: 11, 3: 50}, 10408070: {1: 9, 2: 11, 3: 50}, 10408071: {1: 9, 2: 11, 3: 50}, 10408072: {1: 9, 2: 11, 3: 50}, 10408073: {1: 9, 2: 11, 3: 50}, 10408074: {1: 9, 2: 11, 3: 50}, 10408075: {1: 9, 2: 11, 3: 50}, 10409075: {1: 10, 2: 11, 3: 50}, 10409076: {1: 10, 2: 11, 3: 50}, 10409077: {1: 10, 2: 11, 3: 50}, 10409078: {1: 10, 2: 11, 3: 50}, 10409079: {1: 10, 2: 11, 3: 50}, 10409080: {1: 10, 2: 11, 3: 50}, 
  # Dark Opus
  10403106: {2: 12, 3: 31}, 10403107: {2: 12, 3: 21}, 10404150: {2: 12, 3: 32}, 10404151: {2: 12, 3: 22}, 10408094: {2: 12, 3: 33}, 10408095: {2: 12, 3: 23}, 10402125: {2: 12, 3: 34}, 10402126: {2: 12, 3: 24}, 10400170: {2: 12, 3: 35}, 10400171: {2: 12, 3: 25}, 10409110: {2: 12, 3: 36}, 10409111: {2: 12, 3: 26},
  # Draconic
  10408119: {2: 40, 3: 41}, 10403119: {2: 40, 3: 42}, 10407096: {2: 40, 3: 43}, 10404167: {2: 40, 3: 44}, 10409121: {2: 40, 3: 45}, 10405123: {2: 40, 3: 46},
}

WEAPONS_ULTIMA = {10400119, 10400120, 10400121, 10400122, 10400123, 10400124, 10401097, 10401098, 10401099, 10401100, 10401101, 10401102, 10402088, 10402089, 10402090, 10402091, 10402092, 10402093, 10403078, 10403079, 10403080, 10403081, 10403082, 10403083, 10404108, 10404109, 10404110, 10404111, 10404112, 10404113, 10405074, 10405075, 10405076, 10405077, 10405078, 10405079, 10406081, 10406082, 10406083, 10406084, 10406085, 10406086, 10407069, 10407070, 10407071, 10407072, 10407073, 10407074, 10408070, 10408071, 10408072, 10408073, 10408074, 10408075, 10409075, 10409076, 10409077, 10409078, 10409079, 10409080}

WEAPONS_KEYS_ICONS = {
  # Atma keys
  1: ['ws_skill_weapon_atk_1.png', 'ws_skill_weapon_da_1.png', 'ws_skill_weapon_hp_1.png', 'ws_skill_weapon_whole_1.png', 'ws_skill_weapon_backwater_1.png', 'ws_skill_weapon_tech_1.png'],  
  2: ['ws_skill_weapon_atk_2.png', 'ws_skill_weapon_da_2.png', 'ws_skill_weapon_hp_2.png', 'ws_skill_weapon_whole_2.png', 'ws_skill_weapon_backwater_2.png', 'ws_skill_weapon_tech_2.png'],
  3: ['ws_skill_weapon_atk_3.png', 'ws_skill_weapon_da_3.png', 'ws_skill_weapon_hp_3.png', 'ws_skill_weapon_whole_3.png', 'ws_skill_weapon_backwater_3.png', 'ws_skill_weapon_tech_3.png'],
  4: ['ws_skill_weapon_atk_4.png', 'ws_skill_weapon_da_4.png', 'ws_skill_weapon_hp_4.png', 'ws_skill_weapon_whole_4.png', 'ws_skill_weapon_backwater_4.png', 'ws_skill_weapon_tech_4.png'],
  5: ['ws_skill_weapon_atk_5.png', 'ws_skill_weapon_da_5.png', 'ws_skill_weapon_hp_5.png', 'ws_skill_weapon_whole_5.png', 'ws_skill_weapon_backwater_5.png', 'ws_skill_weapon_tech_5.png'],
  6: ['ws_skill_weapon_atk_6.png', 'ws_skill_weapon_da_6.png', 'ws_skill_weapon_hp_6.png', 'ws_skill_weapon_whole_6.png', 'ws_skill_weapon_backwater_6.png', 'ws_skill_weapon_tech_6.png'],
  7: ['ws_skill_weapon_atk_7.png', 'ws_skill_weapon_da_7.png', 'ws_skill_weapon_hp_7.png', 'ws_skill_weapon_whole_7.png', 'ws_skill_weapon_backwater_7.png', 'ws_skill_weapon_tech_7.png'],
  8: ['ws_skill_weapon_atk_8.png', 'ws_skill_weapon_da_8.png', 'ws_skill_weapon_hp_8.png', 'ws_skill_weapon_whole_8.png', 'ws_skill_weapon_backwater_8.png', 'ws_skill_weapon_tech_8.png'],
  9: ['ws_skill_weapon_atk_9.png', 'ws_skill_weapon_da_9.png', 'ws_skill_weapon_hp_9.png', 'ws_skill_weapon_whole_9.png', 'ws_skill_weapon_backwater_9.png', 'ws_skill_weapon_tech_9.png'],
  10: ['ws_skill_weapon_atk_10.png', 'ws_skill_weapon_da_10.png', 'ws_skill_weapon_hp_10.png', 'ws_skill_weapon_whole_10.png', 'ws_skill_weapon_backwater_10.png', 'ws_skill_weapon_tech_10.png'],
  # Ultima keys
  11: ['ws_skill_normal_limit.png', 'ws_skill_ability_limit.png', 'ws_skill_special_limit.png', 'ws_skill_chain_limit.png'],
  # Dark Opus 2nd key
  12: ['ws_skill_normal_limit.png', 'ws_skill_ability_limit.png', 'ws_skill_special_limit.png', 'ws_skill_chain_limit.png'],
  # Dark Opus 3rd keys
  21: ['ws_skill_whole_m_1_3.png', 'ws_skill_backwater_m_1_3.png', 'ws_skill_ta_m_1_2.png', 'ws_skill_moment_m_1.png', 'ws_skill_god_m_1_2.png', 'ws_skill_hero_m_1_3.png'],
  31: ['ws_skill_whole_1_3.png', 'ws_skill_backwater_1_3.png', 'ws_skill_ta_1_2.png', 'ws_skill_moment_1.png', 'ws_skill_god_1_2.png', 'ws_skill_hero_1_3.png'],
  22: ['ws_skill_whole_m_2_3.png', 'ws_skill_backwater_m_2_3.png', 'ws_skill_ta_m_2_2.png', 'ws_skill_moment_m_2.png', 'ws_skill_god_m_2_2.png', 'ws_skill_hero_m_2_3.png'],
  32: ['ws_skill_whole_2_3.png', 'ws_skill_backwater_2_3.png', 'ws_skill_ta_2_2.png', 'ws_skill_moment_2.png', 'ws_skill_god_2_2.png', 'ws_skill_hero_2_3.png'],
  23: ['ws_skill_whole_m_3_3.png', 'ws_skill_backwater_m_3_3.png', 'ws_skill_ta_m_3_2.png', 'ws_skill_moment_m_3.png', 'ws_skill_god_m_3_2.png', 'ws_skill_hero_m_3_3.png'],
  33: ['ws_skill_whole_3_3.png', 'ws_skill_backwater_3_3.png', 'ws_skill_ta_3_2.png', 'ws_skill_moment_3.png', 'ws_skill_god_3_2.png', 'ws_skill_hero_3_3.png'],
  24: ['ws_skill_whole_m_4_3.png', 'ws_skill_backwater_m_4_3.png', 'ws_skill_ta_m_4_2.png', 'ws_skill_moment_m_4.png', 'ws_skill_god_m_4_2.png', 'ws_skill_hero_m_4_3.png'],
  34: ['ws_skill_whole_4_3.png', 'ws_skill_backwater_4_3.png', 'ws_skill_ta_4_2.png', 'ws_skill_moment_4.png', 'ws_skill_god_4_2.png', 'ws_skill_hero_4_3.png'],
  25: ['ws_skill_whole_m_5_3.png', 'ws_skill_backwater_m_5_3.png', 'ws_skill_ta_m_5_2.png', 'ws_skill_moment_m_5.png', 'ws_skill_god_m_5_2.png', 'ws_skill_hero_m_5_3.png'],
  35: ['ws_skill_whole_5_3.png', 'ws_skill_backwater_5_3.png', 'ws_skill_ta_5_2.png', 'ws_skill_moment_5.png', 'ws_skill_god_5_2.png', 'ws_skill_hero_5_3.png'],
  26: ['ws_skill_whole_m_6_3.png', 'ws_skill_backwater_m_6_3.png', 'ws_skill_ta_m_6_2.png', 'ws_skill_moment_m_6.png', 'ws_skill_god_m_6_2.png', 'ws_skill_hero_m_6_3.png'],
  36: ['ws_skill_whole_6_3.png', 'ws_skill_backwater_6_3.png', 'ws_skill_ta_6_2.png', 'ws_skill_moment_6.png', 'ws_skill_god_6_2.png', 'ws_skill_hero_6_3.png'],
  # Draconic 2nd skill
  40: ['skill_damage_red_0.png', 'ws_skill_damage_red_1.png', 'ws_skill_damage_red_2.png', 'ws_skill_damage_red_3.png', 'ws_skill_damage_red_4.png', 'ws_skill_damage_red_5.png', 'ws_skill_damage_red_6.png'],
  # Draconic 3rd skill
  41: ['ws_skill_god_m_1_3.png', 'ws_skill_god_1_3.png'],
  42: ['ws_skill_god_m_2_3.png', 'ws_skill_god_2_3.png'],
  43: ['ws_skill_god_m_3_3.png', 'ws_skill_god_3_3.png'],
  44: ['ws_skill_god_m_4_3.png', 'ws_skill_god_4_3.png'],
  45: ['ws_skill_god_m_5_3.png', 'ws_skill_god_5_3.png'],
  46: ['ws_skill_god_m_6_3.png', 'ws_skill_god_6_3.png'],
  # Ultima 3rd skill
  50: [],
}

def getWeaponSkillKey(weapon_id, skill_index):
  if weapon_id in WEAPONS_KEYS:
    if skill_index in WEAPONS_KEYS[weapon_id]:
      return WEAPONS_KEYS[weapon_id][skill_index]
  return None

def getValue(value, map):
	return str(map.index(value.lower()))

def bashEscape(str):
	return str.replace('(', '\\(').replace(')', '\\)')

def toInt(str):
	if not str:
		return 1
	return int(str)

ix_map = {'s1': 1, 's2': 2, 's3': 3, 's4': 4, 'ex1': 5, 'ex2': 6, 'ex3': 7, 'ex4': 8, 'ex5': 9}

def sortClasse(a, b):
  if ix_map[a['ix']] < ix_map[b['ix']]:
    return -1
  elif ix_map[a['ix']] > ix_map[b['ix']]:
    return 1
  else:
    return 0

def unescape(string):
  result = html.unescape(string)
  if result != string:
    return unescape(result)
  return result

def getConfig(filename, section):
	# create a parser
	parser = ConfigParser()
	# read config file
	parser.read(filename)
 
	# get section, default to postgresql
	db = {}
	if parser.has_section(section):
		params = parser.items(section)
		for param in params:
			db[param[0]] = param[1]
	else:
		raise Exception('Section {0} not found in the {1} file'.format(section, filename))
 
	return db

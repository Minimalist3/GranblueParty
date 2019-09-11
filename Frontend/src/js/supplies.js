const categories = {
  quest: 100,
  coop: 200,
  anima: 300,
  arcarum: 400,
}

const items = {
  rupie: {
    name: 'Rupie',
    category: 'quest',
  },
  flawlessprism: {
    name: 'Flawless Prism',
    category: 'quest',
  },
  rainbowprism: {
    name: 'Rainbow Prism',
    category: 'quest',
  },
  suprememerit: {
    name: 'Supreme Merit',
    category: 'quest',
  },
  legendarymerit: {
    name: 'Legendary Merit',
    category: 'quest',
  },
  silvercentrum: {
    name: 'Silver Centrum',
    category: 'quest',
  },
  sunlightstone: {
    name: 'Sunlight Stone',
    category: 'quest',
  },
  genesisfragment: {
    name: 'Genesis Fragment',
    category: 'quest',
  },
  primevalhorn: {
    name: 'Primeval Horn',
    category: 'quest',
  },
  sephirastone: {
		name: 'Sephira Stone',
    category: 'arcarum',
  },
  sephiraevolite: {
    name: 'Sephira Evolite',
    category: 'arcarum',
  },
  // Dragon Scales
  reddragonscale: {
    name: 'Red Dragon Scale',
    category: 'quest',
  },
  bluedragonscale: {
    name: 'Blue Dragon Scale',
    category: 'quest',
  },
  browndragonscale: {
    name: 'Brown Dragon Scale',
    category: 'quest',
  },
  greendragonscale: {
    name: 'Green Dragon Scale',
    category: 'quest',
  },
  whitedragonscale: {
    name: 'White Dragon Scale',
    category: 'quest',
  },
  blackdragonscale: {
    name: 'Black Dragon Scale',
    category: 'quest',
  },
  // Treasures
  toxictulip: {
    name: 'Toxic Tulip',
    category: 'quest',
  },
  bestiafruit: {
    name: 'Bestia Fruit',
    category: 'quest',
  },
  jumbobeastbone: {
    name: 'Jumbo Beast Bone',
    category: 'quest',
  },
  klugerherb: {
    name: 'Kluger Herb',
    category: 'quest',
  },
  rhempepper: {
    name: 'Rhem Pepper',
    category: 'quest',
  },
  brokenteacup: {
    name: 'Broken Teacup',
    category: 'quest',
  },
  rustyeave: {
    name: 'Rusty Eave',
    category: 'quest',
  },
  translucentsilk: {
    name: 'Translucent Silk',
    category: 'quest',
  },
  meditativesutra: {
    name: 'Meditative Sutra',
    category: 'quest',
  },
  dustybook: {
    name: 'Dusty Book',
    category: 'quest',
  },
  // Co-op Rotating Showdown Item
  infernalgarnet: {
    name: 'Infernal Garnet',
    category: 'coop',
  },
  frozenhellprism: {
    name: 'Frozen Hell Prism',
    category: 'coop',
  },
  eviljudgecrystal: {
    name: 'Evil Judge Crystal',
    category: 'coop',
  },
  horsemansplate: {
    name: 'Horseman\'s Plate',
    category: 'coop',
  },
  halolightquartz: {
    name: 'Halo Light Quartz',
    category: 'coop',
  },
  phantomdemonjewel: {
    name: 'Phantom Demon Jewel',
    category: 'coop',
  },
  // Elemental Quartz
  firequartz: {
    name: 'Fire Quartz',
    category: 'quest',
  },
  waterquartz: {
    name: 'Water Quartz',
    category: 'quest',
  },
  earthquartz: {
    name: 'Earth Quartz',
    category: 'quest',
  },
  windquartz: {
    name: 'Wind Quartz',
    category: 'quest',
  },
  lightquartz: {
    name: 'Light Quartz',
    category: 'quest',
  },
  darkquartz: {
    name: 'Dark Quartz',
    category: 'quest',
  },
  // Trial Fragment
  hellfirefragment: {
    name: 'Hellfire Fragment',
    category: 'quest',
  },
  delugefragment: {
    name: 'Deluge Fragment',
    category: 'quest',
  },
  wastelandfragment: {
    name: 'Wasteland Fragment',
    category: 'quest',
  },
  typhoonfragment: {
    name: 'Typhoon Fragment',
    category: 'quest',
  },
  // Astra
	flameborneastra: {
		name: 'Flameborne Astra',
    category: 'arcarum',
  },
	aquaborneastra: {
		name: 'Aquaborne Astra',
    category: 'arcarum',
  },
  earthborneastra: {
		name: 'Earthborne Astra',
    category: 'arcarum',
  },
  windborneastra: {
		name: 'Windborne Astra',
    category: 'arcarum',
  },
  lightborneastra: {
		name: 'Lightborne Astra',
    category: 'arcarum',
  },
  darkborneastra: {
		name: 'Darkborne Astra',
    category: 'arcarum',
  },
  // Idean
	justiceidean: {
		name: 'Justice Idean',
    category: 'arcarum',
  },
  hangedmanidean: {
		name: 'Hanged Man Idean',
    category: 'arcarum',
  },
  deathidean: {
		name: 'Death Idean',
    category: 'arcarum',
  },
  temperanceidean: {
		name: 'Temperance Idean',
    category: 'arcarum',
  },
  devilidean: {
		name: 'Devil Idean',
    category: 'arcarum',
  },
  toweridean: {
		name: 'Tower Idean',
    category: 'arcarum',
  },
  staridean: {
		name: 'Star Idean',
    category: 'arcarum',
  },
  moonidean: {
		name: 'Moon Idean',
    category: 'arcarum',
  },
  sunidean: {
		name: 'Sun Idean',
    category: 'arcarum',
  },
  judgementidean: {
		name: 'Judgement Idean',
    category: 'arcarum',
  },
  // Verum
  fireverum: {
    name: 'Fire Verum Proof',
    category: 'arcarum',
  },
  waterverum: {
    name: 'Water Verum Proof',
    category: 'arcarum',
  },
  earthverum: {
    name: 'Earth Verum Proof',
    category: 'arcarum',
  },
  windverum: {
    name: 'Wind Verum Proof',
    category: 'arcarum',
  },
  // Haze
  aurorahaze: {
    name: 'Aurora Haze',
    category: 'arcarum',
  },
  chaotichaze: {
    name: 'Chaotic Haze',
    category: 'arcarum',
  },
  // Arcarum Fragment
  aquilafragment: {
    name: 'Aquila Fragment',
    category: 'arcarum',
  },
  bellatorfragment: {
    name: 'Bellator Fragment',
    category: 'arcarum',
  },
  celsusfragment: {
    name: 'Celsus Fragment',
    category: 'arcarum',
  },
  // Omega Anima
  fireomegaanima: {
    name: 'Colossus Omega Anima',
    category: 'anima',
  },
  wateromegaanima: {
    name: 'Leviathan Omega Anima',
    category: 'anima',
  },
  earthomegaanima: {
    name: 'Yggdrasil Omega Anima',
    category: 'anima',
  },
  windomegaanima: {
    name: 'Tiamat Omega Anima',
    category: 'anima',
  },
  lightomegaanima: {
    name: 'Luminiera Omega Anima',
    category: 'anima',
  },
  darkomegaanima: {
    name: 'Celeste Omega Anima',
    category: 'anima',
  },
  // Omega 2 Omega Anima
  fireomega2omegaanima: {
    name: 'Shiva Omega Anima',
    category: 'anima',
  },
  wateromega2omegaanima: {
    name: 'Europa Omega Anima',
    category: 'anima',
  },
  earthomega2omegaanima: {
    name: 'Alexiel Omega Anima',
    category: 'anima',
  },
  windomega2omegaanima: {
    name: 'Grimnir Omega Anima',
    category: 'anima',
  },
  lightomega2omegaanima: {
    name: 'Metatron Omega Anima',
    category: 'anima',
  },
  darkomega2omegaanima: {
    name: 'Avatar Omega Anima',
    category: 'anima',
  },  
  // Tier 1 Summon Anima
  firet1anima: {
    name: 'Twin Elements Anima',
    category: 'anima',
  },
  watert1anima: {
    name: 'Macula Marius Anima',
    category: 'anima',
  },
  eartht1anima: {
    name: 'Medusa Anima',
    category: 'anima',
  },
  windt1anima: {
    name: 'Nezha Anima',
    category: 'anima',
  },
  lightt1anima: {
    name: 'Apollo Anima',
    category: 'anima',
  },
  darkt1anima: {
    name: 'Dark Angel Olivia Anima',
    category: 'anima',
  },
  // Tier 2 Summon Anima
  firet2anima: {
    name: 'Athena Anima',
    category: 'anima',
  },
  watert2anima: {
    name: 'Grani Anima',
    category: 'anima',
  },
  eartht2anima: {
    name: 'Baal Anima',
    category: 'anima',
  },
  windt2anima: {
    name: 'Garuda Anima',
    category: 'anima',
  },
  lightt2anima: {
    name: 'Odin Anima',
    category: 'anima',
  },
  darkt2anima: {
    name: 'Lich Anima',
    category: 'anima',
  },
  // Primarch Anima
  michaelanima: {
    name: 'Michael Anima',
    category: 'anima',
  },
  gabrielanima: {
    name: 'Gabriel Anima',
    category: 'anima',
  },
  urielanima: {
    name: 'Uriel Anima',
    category: 'anima',
  },
  raphaelanima: {
    name: 'Raphael Anima',
    category: 'anima',
  },
}

const groups = {
  quartz: {
		type: 'element',
    fire: 'firequartz',
    water: 'waterquartz',
    earth: 'earthquartz',
    wind: 'windquartz',
    light: 'lightquartz',
    dark: 'darkquartz'
  },
  trialfragment: {
    type: 'element',
    fire: 'hellfirefragment',
    water: 'delugefragment',
    earth: 'wastelandfragment',
    wind: 'typhoonfragment',
    light: ['hellfirefragment', 'typhoonfragment'],
    dark: ['delugefragment', 'wastelandfragment']
  },
  dragonscale: {
		type: 'element',
    fire: 'reddragonscale',
    water: 'bluedragonscale',
    earth: 'browndragonscale',
    wind: 'greendragonscale',
    light: 'whitedragonscale',
    dark: 'blackdragonscale'
  },
  // Co-op
  coopshowdownitem: {
		type: 'element',
    fire: 'infernalgarnet',
    water: 'frozenhellprism',
    earth: 'eviljudgecrystal',
    wind: 'horsemansplate',
    light: 'halolightquartz',
    dark: 'phantomdemonjewel'
  },
  // Arcarum  
	astra: {
		type: 'element',
    fire: 'flameborneastra',
    water: 'aquaborneastra',
    earth: 'earthborneastra',
    wind: 'windborneastra',
    light: 'lightborneastra',
    dark: 'darkborneastra'
	},
	idean: {
		type: 'summon',
    2040236: 'justiceidean',
    2040237: 'hangedmanidean',
    2040238: 'deathidean',
    2040239: 'temperanceidean',
    2040240: 'devilidean',
    2040241: 'toweridean',
    2040242: 'staridean',
    2040243: 'moonidean',
    2040244: 'sunidean',
    2040245: 'judgementidean',    
  },
  verum: {
    type: 'element',
    fire: 'fireverum',
    water: 'waterverum',
    earth: 'earthverum',
    wind: 'windverum',
    light: ['fireverum', 'windverum'],
    dark: ['waterverum', 'earthverum']
  },
  haze: {
		type: 'element',
    fire: 'aurorahaze',
    water: 'chaotichaze',
    earth: 'chaotichaze',
    wind: 'aurorahaze',
    light: 'aurorahaze',
    dark: 'chaotichaze'
  },
  arcarumfragment: {
		type: 'summon',
    2040236: 'bellatorfragment',
    2040237: 'aquilafragment',
    2040238: 'celsusfragment',
    2040239: 'celsusfragment',
    2040240: 'aquilafragment',
    2040241: 'celsusfragment',
    2040242: 'celsusfragment',
    2040243: 'bellatorfragment',
    2040244: 'aquilafragment',
    2040245: 'bellatorfragment',    
  },
  arcarumssr5treasure: {
		type: 'summon',
    2040236: 'toxictulip',
    2040237: 'bestiafruit',
    2040238: 'jumbobeastbone',
    2040239: 'klugerherb',
    2040240: 'rhempepper',
    2040241: 'brokenteacup',
    2040242: 'rustyeave',
    2040243: 'translucentsilk',
    2040244: 'meditativesutra',
    2040245: 'dustybook',
  },
  // Anima
  omegaanima: {
		type: 'element',
    fire: 'fireomegaanima',
    water: 'wateromegaanima',
    earth: 'earthomegaanima',
    wind: 'windomegaanima',
    light: 'lightomegaanima',
    dark: 'darkomegaanima'
  },
  omega2omegaanima: {
		type: 'element',
    fire: 'fireomega2omegaanima',
    water: 'wateromega2omegaanima',
    earth: 'earthomega2omegaanima',
    wind: 'windomega2omegaanima',
    light: 'lightomega2omegaanima',
    dark: 'darkomega2omegaanima'
  },
  t1anima: {
		type: 'element',
    fire: 'firet1anima',
    water: 'watert1anima',
    earth: 'eartht1anima',
    wind: 'windt1anima',
    light: 'lightt1anima',
    dark: 'darkt1anima'
  },
  t2anima: {
		type: 'element',
    fire: 'firet2anima',
    water: 'watert2anima',
    earth: 'eartht2anima',
    wind: 'windt2anima',
    light: 'lightt2anima',
    dark: 'darkt2anima'
  },
  primarchanima: {
    type: 'element',
    fire: 'michaelanima',
    water: 'gabrielanima',
    earth: 'urielanima',
    wind: 'raphaelanima',
    light: ['michaelanima', 'raphaelanima'],
    dark: ['gabrielanima', 'urielanima']
  }
}

export default {
  categories,
  items,
  groups,
}
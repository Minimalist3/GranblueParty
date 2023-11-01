class Item {
  constructor(name, category, animated = false) {
    this.name = name;
    this.category = category;
    this.animated = animated;
  }
};

const Categories = Object.freeze({
  quest: 100,
  coop: 200,
  anima: 300,
  arcarum: 400,
});

const items = Object.freeze({
  rupie: new Item('Rupie', Categories.quest),
  crystal: new Item('Crystal', Categories.quest),
  blueskycristal: new Item('Blue Sky Crystal', Categories.quest),
  satinfeather: new Item('Satin Feather', Categories.quest),
  untamedflame: new Item('Untamed Flame', Categories.quest),
  roughstone: new Item('Rough Stone', Categories.quest),
  freshwaterjug: new Item('Fresh Water Jug', Categories.quest),
  vermilionstone: new Item('Vermilion Stone', Categories.quest),
  hollowsoul: new Item('Hollow Soul', Categories.quest),
  zephyrfeather: new Item('Zephyr Feather', Categories.quest),
  falconfeather: new Item('Falcon Feather', Categories.quest),
  forebodingclover: new Item('Foreboding Clover', Categories.quest),
  swirlingamber: new Item('Swirling Amber', Categories.quest),
  lacrimosa: new Item('Lacrimosa', Categories.quest),
  bloodamber: new Item('Blood Amber', Categories.quest),
  antiquecloth: new Item('Antique Cloth', Categories.quest),
  goldbrick: new Item('Gold Brick', Categories.quest),
  damascuscrystal: new Item('Damascus Crystal', Categories.quest),
  brightspirits: new Item('Bright Spirits', Categories.quest),
  murkyspirits: new Item('Murky Spirits', Categories.quest),
  blueskyspirit: new Item('Blue-Sky Spirit', Categories.quest),
  truedragonsgoldenscale: new Item('True Dragon\'s Golden Scale', Categories.quest),
  tearsoftheapocalypse: new Item('Tears of the Apocalypse', Categories.quest),
  abyssalwing: new Item('Abyssal Wing', Categories.quest),
  cunningdevilshorn: new Item('Cunning Devil\'s Horn', Categories.quest),
  eternitysand: new Item('Eternity Sand', Categories.quest),
  //: new Item('', Categories.quest),
  flawlessprism: new Item('Flawless Prism', Categories.quest),
  flawedprism: new Item('Flawed Prism', Categories.quest),
  rainbowprism: new Item('Rainbow Prism', Categories.quest),
  championmerit: new Item('Champion Merit', Categories.quest),
  suprememerit: new Item('Supreme Merit', Categories.quest),
  legendarymerit: new Item('Legendary Merit', Categories.quest),
  lapismerit: new Item('Lapis Merit', Categories.quest),
  silvercentrum: new Item('Silver Centrum', Categories.quest),
  sunlightstone: new Item('Sunlight Stone', Categories.quest),
  genesisfragment: new Item('Genesis Fragment', Categories.quest),
  primevalhorn: new Item('Primeval Horn', Categories.quest),
  malicefragment: new Item('Malice Fragment', Categories.quest),
  verdantazurite: new Item('Verdant Azurite', Categories.quest),
  sephirastone: new Item('Sephira Stone', Categories.arcarum),
  sephiraevolite: new Item('Sephira Evolite', Categories.arcarum),
  newworldquartz: new Item('New World Quartz', Categories.arcarum),
  // Dragon Scales
  reddragonscale: new Item('Red Dragon Scale', Categories.quest),
  bluedragonscale: new Item('Blue Dragon Scale', Categories.quest),
  browndragonscale: new Item('Brown Dragon Scale', Categories.quest),
  greendragonscale: new Item('Green Dragon Scale', Categories.quest),
  whitedragonscale: new Item('White Dragon Scale', Categories.quest),
  blackdragonscale: new Item('Black Dragon Scale', Categories.quest),
  // High Orbs
  orbfire: new Item('Inferno Orb', Categories.quest),
  orbwater: new Item('Frost Orb', Categories.quest),
  orbearth: new Item('Rumbling Orb', Categories.quest),
  orbwind: new Item('Cyclone Orb', Categories.quest),
  orblight: new Item('Shining Orb', Categories.quest),
  orbdark: new Item('Abysm Orb', Categories.quest),
  // Low Orbs
  loworbfire: new Item('Fire Orb', Categories.quest),
  loworbwater: new Item('Water Orb', Categories.quest),
  loworbearth: new Item('Earth Orb', Categories.quest),
  loworbwind: new Item('Wind Orb', Categories.quest),
  loworblight: new Item('Light Orb', Categories.quest),
  loworbdark: new Item('Dark Orb', Categories.quest),
  loworb: new Item('Low Orb', Categories.quest, true),
  // Scrolls
  scrollfire: new Item('Hellfire Scroll', Categories.quest),
  scrollwater: new Item('Flood Scroll', Categories.quest),
  scrollearth: new Item('Thunder Scroll', Categories.quest),
  scrollwind: new Item('Gale Scroll', Categories.quest),
  scrolllight: new Item('Skylight Scroll', Categories.quest),
  scrolldark: new Item('Chasm Scroll', Categories.quest),
  // Tomes
  tomefire: new Item('Red Tome', Categories.quest),
  tomewater: new Item('Blue Tome', Categories.quest),
  tomeearth: new Item('Brown Tome', Categories.quest),
  tomewind: new Item('Green Tome', Categories.quest),
  tomelight: new Item('White Tome', Categories.quest),
  tomedark: new Item('Black Tome', Categories.quest),
  // Grimoires
  firegrimoire: new Item('Fire Grimoire', Categories.quest),
  watergrimoire: new Item('Water Grimoire', Categories.quest),
  earthgrimoire: new Item('Earth Grimoire', Categories.quest),
  windgrimoire: new Item('Wind Grimoire', Categories.quest),
  // True Anima
  trueanimafire: new Item('True Fire Anima', Categories.quest),
  trueanimawater: new Item('True Water Anima', Categories.quest),
  trueanimaearth: new Item('True Earth Anima', Categories.quest),
  trueanimawind: new Item('True Wind Anima', Categories.quest),
  trueanimalight: new Item('True Light Anima', Categories.quest),
  trueanimadark: new Item('True Dark Anima', Categories.quest),
  trueanima: new Item('True Anima', Categories.quest, true),
  // Whorls
  whorlfire: new Item('Infernal Whorl', Categories.quest),
  whorlwater: new Item('Tidal Whorl', Categories.quest),
  whorlearth: new Item('Seismic Whorl', Categories.quest),
  whorlwind: new Item('Tempest Whorl', Categories.quest),
  whorllight: new Item('Radiant Whorl', Categories.quest),
  whorldark: new Item('Umbral Whorl', Categories.quest),
  whorl: new Item('Whorl', Categories.quest, true),
  // Centrums
  rubeuscentrum: new Item('Rubeus Centrum', Categories.quest),
  indicuscentrum: new Item('Indicus Centrum', Categories.quest),
  luteuscentrum: new Item('Luteus Centrum', Categories.quest),
  galbinuscentrum: new Item('Galbinus Centrum', Categories.quest),
  niveuscentrum: new Item('Niveus Centrum', Categories.quest),
  atercentrum: new Item('Ater Centrum', Categories.quest),
  // Treasures
  toxictulip: new Item('Toxic Tulip', Categories.quest),
  bestiafruit: new Item('Bestia Fruit', Categories.quest),
  jumbobeastbone: new Item('Jumbo Beast Bone', Categories.quest),
  klugerherb: new Item('Kluger Herb', Categories.quest),
  rhempepper: new Item('Rhem Pepper', Categories.quest),
  brokenteacup: new Item('Broken Teacup', Categories.quest),
  rustyeave: new Item('Rusty Eave', Categories.quest),
  translucentsilk: new Item('Translucent Silk', Categories.quest),
  meditativesutra: new Item('Meditative Sutra', Categories.quest),
  dustybook: new Item('Dusty Book', Categories.quest),
  // Co-op Rotating Showdown Item
  infernalgarnet: new Item('Infernal Garnet', Categories.coop),
  frozenhellprism: new Item('Frozen Hell Prism', Categories.coop),
  eviljudgecrystal: new Item('Evil Judge Crystal', Categories.coop),
  horsemansplate: new Item('Horseman\'s Plate', Categories.coop),
  halolightquartz: new Item('Halo Light Quartz', Categories.coop),
  phantomdemonjewel: new Item('Phantom Demon Jewel', Categories.coop),
  // Class distinctions
  guardiandistinction: new Item('Guardian Distinction', Categories.coop),
  sharpshooterdistinction: new Item('Sharpshooter Distinction', Categories.coop),
  gladiatordistinction: new Item('Gladiator Distinction', Categories.coop),
  fencerdistinction: new Item('Fencer Distinction', Categories.coop),
  pilgrimdistinction: new Item('Pilgrim Distinction', Categories.coop),
  combatantdistinction: new Item('Combatant Distinction', Categories.coop),
  swordmasterdistinction: new Item('Sword Master Distinction', Categories.coop),
  samuraidistinction: new Item('Samurai Distinction', Categories.coop),
  troubadourdistinction: new Item('Troubadour Distinction', Categories.coop),
  banditdistinction: new Item('Bandit Distinction', Categories.coop),
  // Elemental Quartz
  firequartz: new Item('Fire Quartz', Categories.quest),
  waterquartz: new Item('Water Quartz', Categories.quest),
  earthquartz: new Item('Earth Quartz', Categories.quest),
  windquartz: new Item('Wind Quartz', Categories.quest),
  lightquartz: new Item('Light Quartz', Categories.quest),
  darkquartz: new Item('Dark Quartz', Categories.quest),
  // Trial Fragment
  hellfirefragment: new Item('Hellfire Fragment', Categories.quest),
  delugefragment: new Item('Deluge Fragment', Categories.quest),
  wastelandfragment: new Item('Wasteland Fragment', Categories.quest),
  typhoonfragment: new Item('Typhoon Fragment', Categories.quest),
  // Urn
  fireurn: new Item('Fire Urn', Categories.quest),
  waterurn: new Item('Water Urn', Categories.quest),
  earthurn: new Item('Earth Urn', Categories.quest),
  windurn: new Item('Wind Urn', Categories.quest),
  lighturn: new Item('Light Urn', Categories.quest),
  darkurn: new Item('Dark Urn', Categories.quest),
  // Weapon Stones
  stoneaxe: new Item('Axe Stone', Categories.quest),
  stonebow: new Item('Bow Stone', Categories.quest),
  stonedagger: new Item('Dagger Stone', Categories.quest),
  stonegauntlet: new Item('Melee Stone', Categories.quest),
  stonegun: new Item('Pistol Stone', Categories.quest),
  stoneharp: new Item('Harp Stone', Categories.quest),
  stonekatana: new Item('Katana Stone', Categories.quest),
  stonelance: new Item('Spear Stone', Categories.quest),
  stonestaff: new Item('Staff Stone', Categories.quest),
  stonesword: new Item('Sword Stone', Categories.quest),
  // Rusted weapons
  rustedaxe: new Item('Rusted Axe', Categories.quest),
  rustedbow: new Item('Rusted Bow', Categories.quest),
  rusteddagger: new Item('Rusted Dagger', Categories.quest),
  rustedgauntlet: new Item('Rusted Gauntlet', Categories.quest),
  rustedgun: new Item('Rusted Gun', Categories.quest),
  rustedharp: new Item('Rusted Harp', Categories.quest),
  rustedkatana: new Item('Rusted Katana', Categories.quest),
  rustedlance: new Item('Rusted Lance', Categories.quest),
  rustedstaff: new Item('Rusted Staff', Categories.quest),
  rustedsword: new Item('Rusted Sword', Categories.quest),
  rustedweapon: new Item('Rusted Weapon', Categories.quest, true),
  // Silver Shards
  silvershardaxe: new Item('Silver Axe Shard', Categories.quest),
  silvershardbow: new Item('Silver Bow Shard', Categories.quest),
  silversharddagger: new Item('Silver Dagger Shard', Categories.quest),
  silvershardgauntlet: new Item('Silver Gauntlet Shard', Categories.quest),
  silvershardgun: new Item('Silver Gun Shard', Categories.quest),
  silvershardharp: new Item('Silver Harp Shard', Categories.quest),
  silvershardkatana: new Item('Silver Katana Shard', Categories.quest),
  silvershardlance: new Item('Silver Spear Shard', Categories.quest),
  silvershardstaff: new Item('Silver Staff Shard', Categories.quest),
  silvershardsword: new Item('Silver Sword Shard', Categories.quest),
  // Silver relics
  silveraxe: new Item('Silver Axe Relic', Categories.quest),
  silverbow: new Item('Silver Bow Relic', Categories.quest),
  silverdagger: new Item('Silver Dagger Relic', Categories.quest),
  silvergauntlet: new Item('Silver Gauntlet Relic', Categories.quest),
  silvergun: new Item('Silver Gun Relic', Categories.quest),
  silverharp: new Item('Silver Harp Relic', Categories.quest),
  silverkatana: new Item('Silver Katana Relic', Categories.quest),
  silverlance: new Item('Silver Spear Relic', Categories.quest),
  silverstaff: new Item('Silver Staff Relic', Categories.quest),
  silversword: new Item('Silver Sword Relic', Categories.quest),
  // Revenant weapons
  revenantw1: new Item('One-Rift Spear', Categories.quest),
  revenantw2: new Item('Two-Crown Bow', Categories.quest),
  revenantw3: new Item('Three-Tiger Axe', Categories.quest),
  revenantw4: new Item('Four-Sky Blade', Categories.quest),
  revenantw5: new Item('Five-Soul Staff', Categories.quest),
  revenantw6: new Item('Six-Ruin Fist', Categories.quest),
  revenantw7: new Item('Seven-Star Sword', Categories.quest),
  revenantw8: new Item('Eight-Life Katana', Categories.quest),
  revenantw9: new Item('Nine-Realm Harp', Categories.quest),
  revenantw10: new Item('Ten-Wolf Gun', Categories.quest),
  // Revenant Weapon Fragment
  wfragment1: new Item('One-Star Fragment', Categories.quest),
  wfragment2: new Item('Two-Star Fragment', Categories.quest),
  wfragment3: new Item('Three-Star Fragment', Categories.quest),
  wfragment4: new Item('Four-Star Fragment', Categories.quest),
  wfragment5: new Item('Five-Star Fragment', Categories.quest),
  wfragment6: new Item('Six-Star Fragment', Categories.quest),
  wfragment7: new Item('Seven-Star Fragment', Categories.quest),
  wfragment8: new Item('Eight-Star Fragment', Categories.quest),
  wfragment9: new Item('Nine-Star Fragment', Categories.quest),
  wfragment10: new Item('Ten-Star Fragment', Categories.quest),
  // Astra
	flameborneastra: new Item('Flameborne Astra', Categories.arcarum),
	aquaborneastra: new Item('Aquaborne Astra', Categories.arcarum),
  earthborneastra: new Item('Earthborne Astra', Categories.arcarum),
  windborneastra: new Item('Windborne Astra', Categories.arcarum),
  lightborneastra: new Item('Lightborne Astra', Categories.arcarum),
  darkborneastra: new Item('Darkborne Astra', Categories.arcarum),
  // Idean
	justiceidean: new Item('Justice Idean', Categories.arcarum),
  hangedmanidean: new Item('Hanged Man Idean', Categories.arcarum),
  deathidean: new Item('Death Idean', Categories.arcarum),
  temperanceidean: new Item('Temperance Idean', Categories.arcarum),
  devilidean: new Item('Devil Idean', Categories.arcarum),
  toweridean: new Item('Tower Idean', Categories.arcarum),
  staridean: new Item('Star Idean', Categories.arcarum),
  moonidean: new Item('Moon Idean', Categories.arcarum),
  sunidean: new Item('Sun Idean', Categories.arcarum),
  judgementidean: new Item('Judgement Idean', Categories.arcarum),
  // Veritas
	justiceveritas: new Item('Justice Veritas', Categories.arcarum),
  hangedmanveritas: new Item('Hanged Man Veritas', Categories.arcarum),
  deathveritas: new Item('Death Veritas', Categories.arcarum),
  temperanceveritas: new Item('Temperance Veritas', Categories.arcarum),
  devilveritas: new Item('Devil Veritas', Categories.arcarum),
  towerveritas: new Item('Tower Veritas', Categories.arcarum),
  starveritas: new Item('Star Veritas', Categories.arcarum),
  moonveritas: new Item('Moon Veritas', Categories.arcarum),
  sunveritas: new Item('Sun Veritas', Categories.arcarum),
  judgementveritas: new Item('Judgement Veritas', Categories.arcarum),
  // Verum
  fireverum: new Item('Fire Verum Proof', Categories.arcarum),
  waterverum: new Item('Water Verum Proof', Categories.arcarum),
  earthverum: new Item('Earth Verum Proof', Categories.arcarum),
  windverum: new Item('Wind Verum Proof', Categories.arcarum),
  // Luster
  fireluster: new Item('Ignis Luster', Categories.arcarum),
  waterluster: new Item('Aqua Luster', Categories.arcarum),
  earthluster: new Item('Terra Luster', Categories.arcarum),
  windluster: new Item('Ventus Luster', Categories.arcarum),
  // Haze
  aurorahaze: new Item('Aurora Haze', Categories.arcarum),
  chaotichaze: new Item('Chaotic Haze', Categories.arcarum),
  // Arcarum Fragment
  aquilafragment: new Item('Aquila Fragment', Categories.arcarum),
  bellatorfragment: new Item('Bellator Fragment', Categories.arcarum),
  celsusfragment: new Item('Celsus Fragment', Categories.arcarum),
  // Gospel
  gospelofgenea: new Item('Gospel of Genea', Categories.arcarum),
  gospelofegeiro: new Item('Gospel of Egeiro', Categories.arcarum),
  gospelofthysia: new Item('Gospel of Thysia', Categories.arcarum),
  gospelofanalipsis: new Item('Gospel of Analipsis', Categories.arcarum),
  // Anima
  animafire: new Item('Colossus Anima', Categories.anima),
  animawater: new Item('Leviathan Anima', Categories.anima),
  animaearth: new Item('Yggdrasil Anima', Categories.anima),
  animawind: new Item('Tiamat Anima', Categories.anima),
  animalight: new Item('Luminiera Anima', Categories.anima),
  animadark: new Item('Celeste Anima', Categories.anima),
  // Omega Anima
  fireomegaanima: new Item('Colossus Omega Anima', Categories.anima),
  wateromegaanima: new Item('Leviathan Omega Anima', Categories.anima),
  earthomegaanima: new Item('Yggdrasil Omega Anima', Categories.anima),
  windomegaanima: new Item('Tiamat Omega Anima', Categories.anima),
  lightomegaanima: new Item('Luminiera Omega Anima', Categories.anima),
  darkomegaanima: new Item('Celeste Omega Anima', Categories.anima),
  // Omega Unique items
  omegauniquefire: new Item('Resolute Reactor', Categories.anima),
  omegauniquewater: new Item('Fanned Fin', Categories.anima),
  omegauniqueearth: new Item('Genesis Bud', Categories.anima),
  omegauniquewind: new Item('Green Dragon Eye', Categories.anima),
  omegauniquelight: new Item('Primal Bit', Categories.anima),
  omegauniquedark: new Item('Black Fog Sphere', Categories.anima),
  // Omega 2 Omega Anima
  fireomega2omegaanima: new Item('Shiva Omega Anima', Categories.anima),
  wateromega2omegaanima: new Item('Europa Omega Anima', Categories.anima),
  earthomega2omegaanima: new Item('Alexiel Omega Anima', Categories.anima),
  windomega2omegaanima: new Item('Grimnir Omega Anima', Categories.anima),
  lightomega2omegaanima: new Item('Metatron Omega Anima', Categories.anima),
  darkomega2omegaanima: new Item('Avatar Omega Anima', Categories.anima),
  // Six-Dragon Advent
  firesixdragon: new Item('Smoldering Rubble', Categories.anima),
  watersixdragon: new Item('Abyssal Tragedy', Categories.anima),
  earthsixdragon: new Item('Insular Core', Categories.anima),
  windsixdragon: new Item('Gale Rock', Categories.anima),
  lightsixdragon: new Item('Thunderbolt Wheel', Categories.anima),
  darksixdragon: new Item('Todestrieb', Categories.anima),
  // Six-Dragon Jewels
  firesixdragonjewel: new Item('Wilnas\'s Jewel', Categories.anima),
  watersixdragonjewel: new Item('Wamdus\'s Jewel', Categories.anima),
  earthsixdragonjewel: new Item('Galleon\'s Jewel', Categories.anima),
  windsixdragonjewel: new Item('Ewiyar\'s Jewel', Categories.anima),
  lightsixdragonjewel: new Item('Lu Woh\'s Jewel', Categories.anima),
  darksixdragonjewel: new Item('Fediel\'s Jewel', Categories.anima),
  // Tier 1 Summon Anima
  firet1anima: new Item('Twin Elements Anima', Categories.anima),
  watert1anima: new Item('Macula Marius Anima', Categories.anima),
  eartht1anima: new Item('Medusa Anima', Categories.anima),
  windt1anima: new Item('Nezha Anima', Categories.anima),
  lightt1anima: new Item('Apollo Anima', Categories.anima),
  darkt1anima: new Item('Dark Angel Olivia Anima', Categories.anima),
  // Tier 2 Summon Anima
  firet2anima: new Item('Athena Anima', Categories.anima),
  watert2anima: new Item('Grani Anima', Categories.anima),
  eartht2anima: new Item('Baal Anima', Categories.anima),
  windt2anima: new Item('Garuda Anima', Categories.anima),
  lightt2anima: new Item('Odin Anima', Categories.anima),
  darkt2anima: new Item('Lich Anima', Categories.anima),
  // Primarch Anima
  michaelanima: new Item('Michael Anima', Categories.anima),
  gabrielanima: new Item('Gabriel Anima', Categories.anima),
  urielanima: new Item('Uriel Anima', Categories.anima),
  raphaelanima: new Item('Raphael Anima', Categories.anima),
  // Halo
  halofire: new Item('Fire Halo', Categories.anima),
  halowater: new Item('Water Halo', Categories.anima),
  haloearth: new Item('Earth Halo', Categories.anima),
  halowind: new Item('Wind Halo', Categories.anima),
  // Sacred beasts Omega Anima
  huanglongomegaanima: new Item('Huanglong Omega Anima', Categories.anima),
  qilinomegaanima: new Item('Qilin Omega Anima', Categories.anima),
});

const GroupType = Object.freeze({
  element: "element",
  summon: "summon",
});

const groups = Object.freeze({
  quartz: {
		type: GroupType.element,
    fire: 'firequartz',
    water: 'waterquartz',
    earth: 'earthquartz',
    wind: 'windquartz',
    light: 'lightquartz',
    dark: 'darkquartz'
  },
  trialfragment: {
    type: GroupType.element,
    fire: 'hellfirefragment',
    water: 'delugefragment',
    earth: 'wastelandfragment',
    wind: 'typhoonfragment',
    light: ['hellfirefragment', 'typhoonfragment'],
    dark: ['delugefragment', 'wastelandfragment']
  },
  dragonscale: {
		type: GroupType.element,
    fire: 'reddragonscale',
    water: 'bluedragonscale',
    earth: 'browndragonscale',
    wind: 'greendragonscale',
    light: 'whitedragonscale',
    dark: 'blackdragonscale'
  },
  urns: {
    type: GroupType.element,
    fire: 'fireurn',
    water: 'waterurn',
    earth: 'earthurn',
    wind: 'windurn',
    light: 'lighturn',
    dark: 'darkurn'
  },
  orbs: {
    type: GroupType.element,
    fire: 'orbfire',
    water: 'orbwater',
    earth: 'orbearth',
    wind: 'orbwind',
    light: 'orblight',
    dark: 'orbdark',
  },
  loworbs: {
    type: GroupType.element,
    fire: 'loworbfire',
    water: 'loworbwater',
    earth: 'loworbearth',
    wind: 'loworbwind',
    light: 'loworblight',
    dark: 'loworbdark',
  },
  scrolls: {
    type: GroupType.element,
    fire: 'scrollfire',
    water: 'scrollwater',
    earth: 'scrollearth',
    wind: 'scrollwind',
    light: 'scrolllight',
    dark: 'scrolldark',
  },
  tomes: {
    type: GroupType.element,
    fire: 'tomefire',
    water: 'tomewater',
    earth: 'tomeearth',
    wind: 'tomewind',
    light: 'tomelight',
    dark: 'tomedark',
  },
  grimoires: {
    type: GroupType.element,
    fire: 'firegrimoire',
    water: 'watergrimoire',
    earth: 'earthgrimoire',
    wind: 'windgrimoire',
    light: ['firegrimoire', 'windgrimoire'],
    dark: ['watergrimoire', 'earthgrimoire']
  },
  spirits: {
    type: GroupType.element,
    fire: 'brightspirits',
    water: 'murkyspirits',
    earth: 'murkyspirits',
    wind: 'brightspirits',
    light: 'brightspirits',
    dark: 'murkyspirits',
  },
  trueanimas: {
    type: GroupType.element,
    fire: 'trueanimafire',
    water: 'trueanimawater',
    earth: 'trueanimaearth',
    wind: 'trueanimawind',
    light: 'trueanimalight',
    dark: 'trueanimadark',
  },
  whorls: {
    type: GroupType.element,
    fire: 'whorlfire',
    water: 'whorlwater',
    earth: 'whorlearth',
    wind: 'whorlwind',
    light: 'whorllight',
    dark: 'whorldark',
  },
  centrums: {
    type: GroupType.element,
    fire: 'rubeuscentrum',
    water: 'indicuscentrum',
    earth: 'luteuscentrum',
    wind: 'galbinuscentrum',
    light: 'niveuscentrum',
    dark: 'atercentrum',
  },
  weaponstones: {
    type: GroupType.summon,
    3040030: 'stonelance',
    3040031: 'stonebow',
    3040032: 'stoneaxe',
    3040033: 'stonedagger',
    3040034: 'stonestaff',
    3040035: 'stonegauntlet',
    3040036: 'stonesword',
    3040037: 'stonekatana',
    3040038: 'stoneharp',
    3040039: 'stonegun',
  },
  rustedw: {
    type: GroupType.summon,
    3040030: 'rustedlance',
    3040031: 'rustedbow',
    3040032: 'rustedaxe',
    3040033: 'rusteddagger',
    3040034: 'rustedstaff',
    3040035: 'rustedgauntlet',
    3040036: 'rustedsword',
    3040037: 'rustedkatana',
    3040038: 'rustedharp',
    3040039: 'rustedgun',
  },
  silverw: {
    type: GroupType.summon,
    3040030: 'silverlance',
    3040031: 'silverbow',
    3040032: 'silveraxe',
    3040033: 'silverdagger',
    3040034: 'silverstaff',
    3040035: 'silvergauntlet',
    3040036: 'silversword',
    3040037: 'silverkatana',
    3040038: 'silverharp',
    3040039: 'silvergun',
  },
  silvershards: {
    type: GroupType.summon,
    3040030: 'silvershardlance',
    3040031: 'silvershardbow',
    3040032: 'silvershardaxe',
    3040033: 'silversharddagger',
    3040034: 'silvershardstaff',
    3040035: 'silvershardgauntlet',
    3040036: 'silvershardsword',
    3040037: 'silvershardkatana',
    3040038: 'silvershardharp',
    3040039: 'silvershardgun',
  },
  revenantw: {
    type: GroupType.summon,
    3040030: 'revenantw1',
    3040031: 'revenantw2',
    3040032: 'revenantw3',
    3040033: 'revenantw4',
    3040034: 'revenantw5',
    3040035: 'revenantw6',
    3040036: 'revenantw7',
    3040037: 'revenantw8',
    3040038: 'revenantw9',
    3040039: 'revenantw10',
  },
  wfragment: {
    type: GroupType.summon,
    3040030: 'wfragment1',
    3040031: 'wfragment2',
    3040032: 'wfragment3',
    3040033: 'wfragment4',
    3040034: 'wfragment5',
    3040035: 'wfragment6',
    3040036: 'wfragment7',
    3040037: 'wfragment8',
    3040038: 'wfragment9',
    3040039: 'wfragment10',
  },
  // Co-op
  coopshowdownitem: {
		type: GroupType.element,
    fire: 'infernalgarnet',
    water: 'frozenhellprism',
    earth: 'eviljudgecrystal',
    wind: 'horsemansplate',
    light: 'halolightquartz',
    dark: 'phantomdemonjewel'
  },
  distinctions: {
    type: GroupType.summon,
    3040030: 'guardiandistinction',
    3040031: 'sharpshooterdistinction',
    3040032: 'gladiatordistinction',
    3040033: 'fencerdistinction',
    3040034: 'pilgrimdistinction',
    3040035: 'combatantdistinction',
    3040036: 'swordmasterdistinction',
    3040037: 'samuraidistinction',
    3040038: 'troubadourdistinction',
    3040039: 'banditdistinction',
  },
  // Arcarum  
	astra: {
		type: GroupType.element,
    fire: 'flameborneastra',
    water: 'aquaborneastra',
    earth: 'earthborneastra',
    wind: 'windborneastra',
    light: 'lightborneastra',
    dark: 'darkborneastra'
	},
	idean: {
		type: GroupType.summon,
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
	veritas: {
		type: GroupType.summon,
    2040236: 'justiceveritas',
    2040237: 'hangedmanveritas',
    2040238: 'deathveritas',
    2040239: 'temperanceveritas',
    2040240: 'devilveritas',
    2040241: 'towerveritas',
    2040242: 'starveritas',
    2040243: 'moonveritas',
    2040244: 'sunveritas',
    2040245: 'judgementveritas',    
  },
  verum: {
    type: GroupType.element,
    fire: 'fireverum',
    water: 'waterverum',
    earth: 'earthverum',
    wind: 'windverum',
    light: ['fireverum', 'windverum'],
    dark: ['waterverum', 'earthverum']
  },
  luster: {
    type: GroupType.element,
    fire: 'fireluster',
    water: 'waterluster',
    earth: 'earthluster',
    wind: 'windluster',
    light: ['fireluster', 'windluster'],
    dark: ['waterluster', 'earthluster']
  },
  gospel: {
    type: GroupType.element,
    fire: 'gospelofegeiro',
    water: 'gospelofanalipsis',
    earth: 'gospelofthysia',
    wind: 'gospelofgenea',
    light: ['gospelofgenea', 'gospelofegeiro'],
    dark: ['gospelofanalipsis', 'gospelofthysia']
  },
  haze: {
		type: GroupType.element,
    fire: 'aurorahaze',
    water: 'chaotichaze',
    earth: 'chaotichaze',
    wind: 'aurorahaze',
    light: 'aurorahaze',
    dark: 'chaotichaze'
  },
  arcarumfragment: {
		type: GroupType.summon,
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
		type: GroupType.summon,
    2040236: 'toxictulip',
    2040237: 'bestiafruit',
    2040238: 'jumbobeastbone',
    2040239: 'klugerherb',
    2040240: 'rhempepper',
    2040241: 'brokenteacup',
    2040242: 'rustyeave',
    2040243: 'translucentsilk',
    2040244: 'meditativesutra',
    2040245: 'dustybook'
  },
  // Anima
  anima: {
		type: GroupType.element,
    fire: 'animafire',
    water: 'animawater',
    earth: 'animaearth',
    wind: 'animawind',
    light: 'animalight',
    dark: 'animadark'
  },
  omegaanima: {
		type: GroupType.element,
    fire: 'fireomegaanima',
    water: 'wateromegaanima',
    earth: 'earthomegaanima',
    wind: 'windomegaanima',
    light: 'lightomegaanima',
    dark: 'darkomegaanima'
  },
  omegaunique: {
		type: GroupType.element,
    fire: 'omegauniquefire',
    water: 'omegauniquewater',
    earth: 'omegauniqueearth',
    wind: 'omegauniquewind',
    light: 'omegauniquelight',
    dark: 'omegauniquedark'
  },
  omega2omegaanima: {
		type: GroupType.element,
    fire: 'fireomega2omegaanima',
    water: 'wateromega2omegaanima',
    earth: 'earthomega2omegaanima',
    wind: 'windomega2omegaanima',
    light: 'lightomega2omegaanima',
    dark: 'darkomega2omegaanima'
  },
  sixdragon: {
		type: GroupType.element,
    fire: 'firesixdragon',
    water: 'watersixdragon',
    earth: 'earthsixdragon',
    wind: 'windsixdragon',
    light: 'lightsixdragon',
    dark: 'darksixdragon'
  },
  sixdragonjewel: {
		type: GroupType.element,
    fire: 'firesixdragonjewel',
    water: 'watersixdragonjewel',
    earth: 'earthsixdragonjewel',
    wind: 'windsixdragonjewel',
    light: 'lightsixdragonjewel',
    dark: 'darksixdragonjewel'
  },
  t1anima: {
		type: GroupType.element,
    fire: 'firet1anima',
    water: 'watert1anima',
    earth: 'eartht1anima',
    wind: 'windt1anima',
    light: 'lightt1anima',
    dark: 'darkt1anima'
  },
  t2anima: {
		type: GroupType.element,
    fire: 'firet2anima',
    water: 'watert2anima',
    earth: 'eartht2anima',
    wind: 'windt2anima',
    light: 'lightt2anima',
    dark: 'darkt2anima'
  },
  primarchanima: {
    type: GroupType.element,
    fire: 'michaelanima',
    water: 'gabrielanima',
    earth: 'urielanima',
    wind: 'raphaelanima',
    light: ['michaelanima', 'raphaelanima'],
    dark: ['gabrielanima', 'urielanima']
  },
  halos: {
    type: GroupType.element,
    fire: 'halofire',
    water: 'halowater',
    earth: 'haloearth',
    wind: 'halowind',
    light: ['halofire', 'halowind'],
    dark: ['halowater', 'haloearth']
  },
  beastsomegaanima: {
    type: GroupType.element,
    fire: 'huanglongomegaanima',
    water: 'qilinomegaanima',
    earth: 'qilinomegaanima',
    wind: 'huanglongomegaanima',
    light: 'huanglongomegaanima',
    dark: 'qilinomegaanima'
  }
});

export default {
  items,
  groups,
}
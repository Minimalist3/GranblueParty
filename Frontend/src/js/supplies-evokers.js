import { Unit, ElementEnum, MaterialStep } from '@/js/supplies-common'

// Evokers (key is summon id)
const EVOKERS_DATA = Object.freeze({
  units: {
    2040236: new Unit('Justice - Maria Theresa - Rise of Justice', ElementEnum.water),
    2040237: new Unit('The Hanged Man - Caim - Binds of The Hanged Man', ElementEnum.earth),
    2040238: new Unit('Death - Nier - Pain of Death', ElementEnum.dark),
    2040239: new Unit('Temperance - Estarriola - Theater of Temperance', ElementEnum.wind),
    2040240: new Unit('The Devil - Fraux - Kiss of The Devil', ElementEnum.fire),
    2040241: new Unit('The Tower - Lobelia - Collapse of The Tower', ElementEnum.earth),
    2040242: new Unit('The Star - Geisenborger - Shooting of The Star', ElementEnum.light),
    2040243: new Unit('The Moon - Haaselia - Reflection of The Moon', ElementEnum.water),
    2040244: new Unit('The Sun - Alanaan - Heat of The Sun', ElementEnum.fire),
    2040245: new Unit('Judgement - Katzelia - Melody of Judgement', ElementEnum.wind)
  },
  materials: [
    new MaterialStep('SR Summon 0*',
      [{"item":"sephirastone","q":2},{"item":"flawlessprism","q":100},{"group":"astra","q":3},{"group":"idean","q":2},{"group":"verum","q":6},{"group":"omegaanima","q":30},{"group":"haze","q":1}]
    ),
    new MaterialStep('SR Summon 1*',
      [{"item":"sephirastone","q":5},{"item":"rainbowprism","q":100},{"group":"astra","q":5},{"group":"idean","q":3},{"group":"verum","q":16},{"group":"quartz","q":100},{"group":"haze","q":3}]
    ),
    new MaterialStep('SR Summon 2*',
      [{"item":"sephirastone","q":10},{"group":"astra","q":10},{"group":"idean","q":5},{"group":"verum","q":30},{"group":"t1anima","q":30},{"group":"haze","q":7}]
    ),
    new MaterialStep('SR Summon 3*',
      [{"item":"sephirastone","q":15},{"item":"legendarymerit","q":3},{"group":"astra","q":15},{"group":"idean","q":7},{"group":"verum","q":50},{"group":"t2anima","q":30},{"group":"haze","q":16}]
    ),
    new MaterialStep('Upgrade Summon to SSR',
      [{"item":"sephirastone","q":30},{"item":"silvercentrum","q":5},{"item":"sunlightstone","q":1},{"group":"astra","q":30},{"group":"idean","q":15},{"group":"verum","q":80},{"group":"primarchanima","q":20},{"group":"haze","q":24}]
    ),
    new MaterialStep('SSR Summon 4*',
      [{"item":"sephirastone","q":45},{"group":"astra","q":45},{"group":"idean","q":25},{"group":"verum","q":120},{"group":"haze","q":32},{"group":"omega2omegaanima","q":10},{"group":"arcarumfragment","q":10}]
    ),
    new MaterialStep('SSR Summon 5*',
      [{"group":"coopshowdownitem","q":100},{"group":"trialfragment","q":50},{"group":"verum","q":250},{"group":"arcarumssr5treasure","q":50},{"item":"genesisfragment","q":80},{"item":"primevalhorn","q":10},{"group":"arcarumfragment","q":20}]
    ),
    new MaterialStep('Recruit Evoker',
      [{"group":"idean","q":20},{"group":"astra","q":200},{"item":"sephirastone","q":30},{"item":"sephiraevolite","q":1}]
    ),
    new MaterialStep('Uncap Evoker 1*',
      [{"group":"verum","q":2},{"item":"flawlessprism","q":5},{"item":"suprememerit","q":1},{"item":"rupie","q":1000}]
    ),
    new MaterialStep('Uncap Evoker 2*',
      [{"group":"astra","q":1},{"group":"verum","q":2},{"item":"flawlessprism","q":10},{"group":"dragonscale","q":1},{"item":"suprememerit","q":3},{"item":"rupie","q":2000}]
    ),
    new MaterialStep('Uncap Evoker 3*',
      [{"group":"astra","q":2},{"group":"verum","q":6},{"item":"rainbowprism","q":3},{"group":"idean","q":1},{"item":"suprememerit","q":6},{"item":"rupie","q":4000}]
    ),
    new MaterialStep('Uncap Evoker 4*',
      [{"group":"astra","q":3},{"group":"verum","q":10},{"group":"haze","q":3},{"group":"idean","q":1},{"item":"suprememerit","q":10},{"item":"rupie","q":20000}]
    ),
    new MaterialStep('1st Domain Bonus',
      [{"item":"genesisfragment","q":30},{"group":"verum","q":120},{"item":"sephirastone","q":5},{"group":"haze","q":20}],
    ),
    new MaterialStep('Buy New World Foundation Weapon',
      [{"item":"newworldquartz","q":5},{"group":"luster","q":5},{"group":"veritas","q":20}],
    ),
    new MaterialStep('Uncap Weapon 1*',
      [{"item":"newworldquartz","q":5},{"group":"luster","q":15},{"group":"veritas","q":70},{"item":"malicefragment","q":30},{"group":"verum","q":100},{"group":"astra","q":30}],
    ),
    new MaterialStep('2nd Domain Bonus',
      [{"group":"urns","q":30},{"group":"verum","q":240},{"group":"astra","q":30},{"group":"haze","q":30},{"item":"sephirastone","q":10}],
    ),
    new MaterialStep('Uncap Weapon 2*',
      [{"item":"newworldquartz","q":10},{"group":"luster","q":30},{"group":"veritas","q":100},{"item":"verdantazurite","q":20},{"group":"verum","q":150},{"group":"astra","q":50},{"group":"idean","q":30}],
    ),
    new MaterialStep('3rd Domain Bonus',
      [{"group":"omega2omegaanima","q":10},{"group":"veritas","q":30},{"group":"astra","q":40},{"group":"idean","q":40},{"group":"arcarumfragment","q":10},{"item":"sephirastone","q":15}],
    ),
    new MaterialStep('Uncap Weapon 3*',
      [{"item":"newworldquartz","q":20},{"group":"luster","q":50},{"group":"veritas","q":130},{"group":"sixdragonjewel","q":20},{"group":"verum","q":200},{"group":"astra","q":100},{"group":"idean","q":70}],
    ),
    new MaterialStep('4th Domain Bonus and Support Skill',
      [{"group":"sixdragon","q":30},{"group":"luster","q":20},{"group":"veritas","q":50},{"group":"astra","q":40},{"group":"idean","q":70},{"group":"arcarumfragment","q":20},{"item":"sephirastone","q":20}],
    ),
    new MaterialStep('Uncap Weapon 4*',
      [{"item":"newworldquartz","q":20},{"group":"veritas","q":150},{"group":"verum","q":250},{"group":"idean","q":100},{"group":"luster","q":60},{"group":"sixdragonjewel","q":30},{"group":"astra","q":120}]
    ),
    new MaterialStep('Uncap Weapon 5*',
      [{"item":"newworldquartz","q":30},{"group":"luster","q":70},{"group":"veritas","q":170},{"group":"sixdragon","q":30},{"group":"arcarumfragment","q":30},{"group":"astra","q":140},{"group":"idean","q":130},{"item":"eternitysand","q":3}]
    ),
  ]
});

export default {
  EVOKERS_DATA,
}
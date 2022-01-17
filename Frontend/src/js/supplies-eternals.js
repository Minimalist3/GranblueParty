import { Unit, ElementEnum, MaterialStep } from '@/js/supplies-common'

// Eternals (key is character id)
const ETERNALS_DATA = Object.freeze({
  units: {
    3040030: new Unit('Anre / Uno', ElementEnum.water),
    3040031: new Unit('Tweyen / Song', ElementEnum.light),
    3040032: new Unit('Threo / Sarasa', ElementEnum.earth),
    3040033: new Unit('Feower / Quatre', ElementEnum.water),
    3040034: new Unit('Fif / Fünf', ElementEnum.light),
    3040035: new Unit('Seox / Six', ElementEnum.dark),
    3040036: new Unit('Seofon / Siete', ElementEnum.wind),
    3040037: new Unit('Eahta / Octo', ElementEnum.earth),
    3040038: new Unit('Niyon / Nio', ElementEnum.wind),
    3040039: new Unit('Tien / Esser', ElementEnum.fire)
  },
  materials: [
    new MaterialStep('4* - Obtain the Revenant Weapon',
      [{"group":"revenantw","q":4}]
    ),
    new MaterialStep('Awaken the Revenant Weapon',
      [{"item":"orblight","q":50},{"item":"scrolllight","q":50},{"item":"whorllight","q":50},{"item":"whitedragonscale","q":50},{"item":"championmerit","q":50},{"item":"crystal","q":100}]
    ),
    new MaterialStep('Change the Revenant Weapon\'s Element',
      [{"group":"rustedw","q":4},{"item":"loworb","q":250},{"item":"whorl","q":250},{"item":"flawedprism","q":250}]
    ),
    new MaterialStep('Upgrade the Revenant Weapon - Step 1',
      [{"item":"satinfeather","q":300},{"item":"untamedflame","q":100},{"item":"roughstone","q":100},{"group":"loworbs","q":100},{"group":"tomes","q":100},{"group":"scrolls","q":150},{"group":"whorls","q":100},{"item":"suprememerit","q":10},{"item":"blueskycristal","q":3},{"item":"crystal","q":100}]
    ),
    new MaterialStep('Upgrade the Revenant Weapon - Step 2',
      [{"item":"freshwaterjug","q":100},{"item":"vermilionstone","q":100},{"item":"hollowsoul","q":100},{"group":"loworbs","q":150},{"group":"tomes","q":150},{"group":"whorls","q":150},{"group":"dragonscale","q":30},{"item":"rainbowprism","q":50},{"group":"trueanimas","q":3},{"item":"blueskycristal","q":5},{"item":"crystal","q":200}]
    ),
    new MaterialStep('Upgrade the Revenant Weapon - Step 3',
      [{"item":"zephyrfeather","q":300},{"item":"falconfeather","q":100},{"item":"forebodingclover","q":80},{"group":"loworbs","q":200},{"group":"whorls","q":200},{"group":"orbs","q":100},{"group":"anima","q":100},{"item":"suprememerit","q":10},{"item":"blueskycristal","q":7},{"item":"crystal","q":300}]
    ),
    new MaterialStep('Upgrade the Revenant Weapon - Step 4',
    [{"item":"swirlingamber","q":100},{"item":"lacrimosa","q":100},{"item":"bloodamber","q":80},{"group":"loworbs","q":250},{"group":"whorls","q":250},{"group":"dragonscale","q":50},{"item":"rainbowprism","q":150},{"group":"trueanimas","q":3},{"item":"blueskycristal","q":10},{"item":"crystal","q":400}]
    ),
    new MaterialStep('Upgrade the Revenant Weapon - Step 5',
    [{"item":"omegauniquewind","q":20},{"item":"omegauniquefire","q":20},{"item":"omegauniquewater","q":20},{"item":"omegauniqueearth","q":20},{"item":"omegauniquelight","q":20},{"item":"omegauniquedark","q":20},{"item":"antiquecloth","q":100},{"item":"suprememerit","q":10},{"item":"blueskycristal","q":15},{"item":"crystal","q":500},{"group":"omegaunique","q":60}]
    ),
    new MaterialStep('Upgrade the Revenant Weapon - Step 6',
      [{"item":"trueanimafire","q":3},{"item":"trueanimawater","q":3},{"item":"trueanimaearth","q":3},{"item":"trueanimawind","q":3},{"item":"trueanimalight","q":3},{"item":"trueanimadark","q":3},{"item":"rainbowprism","q":250},{"item":"blueskycristal","q":30},{"item":"goldbrick","q":1},{"item":"crystal","q":500}]
    ),
    new MaterialStep('5* - Acquire 4 Silver Relics',
      [{"group":"silverw","q":4}]
    ),
    new MaterialStep('Uncap Silver Relic to 4*',
      [{"group":"weaponstones","q":300},{"item":"firequartz","q":300},{"item":"waterquartz","q":300},{"item":"earthquartz","q":300},{"item":"windquartz","q":300},{"item":"lightquartz","q":300},{"item":"darkquartz","q":300}]
    ),
    new MaterialStep('Reduce 10 Revenant Weapons',
      [{"item":"orblight","q":500},{"item":"scrolllight","q":500},{"item":"whorllight","q":500},{"item":"whitedragonscale","q":500},{"item":"championmerit","q":500},{"item":"crystal","q":1000},{"group":"revenantw","q":40},{"item":"flawedprism","q":2500},{"item":"trueanima","q":30},{"group":"rustedw","q":40},{"item":"whorl","q":2500},{"item":"loworb","q":2500}]
    ),
    new MaterialStep('Craft Gold Relic',
      [{"item":"goldbrick","q":1},{"item":"silvercentrum","q":10},{"item":"damascuscrystal","q":10},{"item":"legendarymerit","q":5},{"group":"distinctions","q":30},{"group":"rustedw","q":24},{"item":"loworbfire","q":250},{"item":"loworbwater","q":250},{"item":"loworbearth","q":250},{"item":"loworbwind","q":250},{"item":"loworblight","q":250},{"item":"loworbdark","q":250},{"item":"whorlfire","q":250},{"item":"whorlwater","q":250},{"item":"whorlearth","q":250},{"item":"whorlwind","q":250},{"item":"whorllight","q":250},{"item":"whorldark","q":250},{"item":"flawedprism","q":1500},{"group":"wfragment","q":100}]
    ),
    new MaterialStep('Uncap Eternal to 5*',
      [{"group":"centrums","q":30},{"group":"urns","q":10},{"group":"spirits","q":2},{"group":"grimoires","q":30},{"item":"rainbowprism","q":100},{"item":"rupie","q":100000}]
    ),
    new MaterialStep('6* - Transcendence Stage 1',
      [{"group":"loworbs","q":7500},{"group":"whorls","q":7500},{"item":"flawedprism","q":7500},{"item":"goldbrick","q":1},{"group":"sixdragon","q":50},{"group":"halos","q":80},{"item":"damascuscrystal","q":20},{"item":"rupie","q":100000},{"group":"rustedw","q":120},{"group":"silvershards","q":200}]
    ),
    new MaterialStep('Reduce 10 Revenant Weapons (again)',
      [{"item":"orblight","q":500},{"item":"scrolllight","q":500},{"item":"whorllight","q":500},{"item":"whitedragonscale","q":500},{"item":"championmerit","q":500},{"item":"crystal","q":1000},{"group":"revenantw","q":40},{"item":"flawedprism","q":2500},{"item":"trueanima","q":30},{"group":"rustedw","q":40},{"item":"whorl","q":2500},{"item":"loworb","q":2500}]
    ),
    new MaterialStep('Transcendence Stage 2',
      [{"group":"omega2omegaanima","q":50},{"group":"urns","q":300},{"group":"wfragment","q":50},{"item":"primevalhorn","q":100},{"item":"legendarymerit","q":100},{"item":"rupie","q":5000000},{"item":"blueskyspirit","q":1}]
    ),
    new MaterialStep('Transcendence Stage 3',
      [{"item":"lapismerit","q":1}]
    ),
    new MaterialStep('Transcendence Stage 4',
      [{"group":"beastsomegaanima","q":30},{"group":"luster","q":30},{"group":"weaponstones","q":2000},{"group":"quartz","q":2000},{"group":"sixdragonjewel","q":300},{"item":"truedragonsgoldenscale","q":50},{"item":"rupie","q":5000000}]
    ),
    new MaterialStep('Transcendence Stage 5',
      [{"item":"tearsoftheapocalypse","q":30},{"item":"abyssalwing","q":30},{"item":"cunningdevilshorn","q":30},{"item":"lapismerit","q":1}]
    ),
  ]
});

export default {
  ETERNALS_DATA,
}
import Vue from 'vue'

function getCharacterLevel(character) {
  switch(character.rarityid) {
    // SSR
    case 2:
      switch(character.stars) {
        case 0:
          return 40;
        case 1:
          return 50;
        case 2:
          return 60;
        case 3:
          return 70;
        case 4:
          return 80;
        case 5:
          return 100;
        case 6:
          return 110;
        case 7:
          return 120;
        case 8:
          return 130;
        case 9:
          return 140;
        case 10:
          return 150;
      }
      return 100;
    // SR
    case 1:
      switch(character.stars) {
        case 0:
          return 30;
        case 1:
          return 40;
        case 2:
          return 50;
        case 3:
          return 60;
        case 4:
          return 70;
      }
      return 90;
  }
  // R
  switch(character.stars) {
    case 0:
      return 20;
    case 1:
      return 30;
    case 2:
      return 40;
  }
  return 50;
}

function getSummonLevel(summon) {
  switch (summon.stars) {
    case 0:
      return 40;
    case 1:
      return 60;
    case 2:
      return 80;
    case 3:
      return 100;
    case 4:
      return 150;
    case 5:
      return 200;
    case 6:
      return 210;
    case 7:
      return 220;
    case 8:
      return 230;
    case 9:
      return 240;
    case 10:
      return 250;
  }
  return 100;
}

function setSummonCurrentData(summon) {
  if (summon.data) {
    switch (summon.stars) {
      case 5:
        if (summon.data["5"]) {
          Vue.set(summon, "current_data", 5);
          break;
        }
      case 4:
        if (summon.data["4"]) {
          Vue.set(summon, "current_data", 4);
          break;
        }
      case 3:
        if (summon.data["3"]) {
          Vue.set(summon, "current_data", 3);
          break;
        }
      default:
        Vue.set(summon, "current_data", 0);
    }
  } else {
    Vue.set(summon, "current_data", undefined);
  }
}

function getWeaponLevel(weapon) {
  switch(weapon.stars) {
    case 0:
      return 40;
    case 1:
      return 60;
    case 2:
      return 80;
    case 3:
      return 100;
    case 4:
      return 150;
  }
  return 200;
}

function getWeaponSkillLevel(weapon) {
  switch(weapon.stars) {
    case 5:
      return 20;
    case 4:
      return 15;
  }
  return 10;
}

export default {
  getCharacterLevel,
  getSummonLevel,
  setSummonCurrentData,
  getWeaponLevel,
  getWeaponSkillLevel,
}
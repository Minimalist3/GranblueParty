// expand gets the whole object in parameter
// show only gets its own attribute

import { LANGUAGES } from '@/js/lang'

export default {
  'n': {
    expand(obj, lang) {
      if (lang === LANGUAGES.JP && obj.hasOwnProperty('nj')) {
        return obj.nj;
      }
      return obj.n;
    },
    show() { return true; },
    add(e, count) { },
  },
  'ri': {
    data: [
      { name: 'R', checked: false },
      { name: 'SR', checked: false },
      { name: 'SSR', checked: true },
    ],
    expand(obj) { return this.data[obj.ri].name; },
    show(e) { return this.data[e].checked; },
    add(e, count) { count[e]++; },
  },
  'e': {
    data: [
      { name: 'Fire', checked: true },
      { name: 'Wind', checked: true },
      { name: 'Earth', checked: true },
      { name: 'Water', checked: true },
      { name: 'Light', checked: true },
      { name: 'Dark', checked: true },
      { name: 'Any', checked: true },
    ],
    expand(obj) { 
      if (obj.e !== null) {
        return this.data[obj.e].name;
      }
      return 'None';
    },
    show(e) { 
      if (e !== null) {
        return this.data[e].checked;
      }
      // Show None when Any is checked
      return this.data[6].checked;
    },
    add(e, count) { count[e]++; },
  },
  't': {
    data: [
      { name: 'Attack', checked: true },
      { name: 'Balanced', checked: true },
      { name: 'Defense', checked: true },
      { name: 'Heal', checked: true },
      { name: 'Special', checked: true },
    ],
    expand(obj) { return this.data[obj.t].name; },
    show(e) { return this.data[e].checked; },
    add(e, count) { count[e]++; },
  },
  'ra': {
    data: [
      { name: 'Human', checked: true },
      { name: 'Draph', checked: true },
      { name: 'Erune', checked: true },
      { name: 'Harvin', checked: true },
      { name: 'Primal', checked: true },
      { name: 'Unknown', checked: true },
    ],
    expand(obj) { return this.data[obj.ra].name; },
    show(e) { return this.data[e].checked; },
    add(e, count) { count[e]++; },
  },
  'w': {
    data: [
      { name: 'Axe', checked: true },
      { name: 'Bow', checked: true },
      { name: 'Dagger', checked: true },
      { name: 'Gun', checked: true },
      { name: 'Harp', checked: true },
      { name: 'Katana', checked: true },
      { name: 'Melee', checked: true },
      { name: 'Sabre', checked: true },
      { name: 'Spear', checked: true },
      { name: 'Staff', checked: true },
    ],
    expand(obj) {
      if (Array.isArray(obj.w)) {
        let res = '';
        obj.w.forEach(w => {
          if (res.length !== 0) {
            res += ', ';
          }
          res += this.data[w].name;
        })
        return res;
      }
      return this.data[obj.w].name;
    },
    show(e) {
      if (Array.isArray(e)) {
        return e.some(i => { return this.data[i].checked })
      }
      return this.data[e].checked;
    },
    add(e, count) { 
      if (Array.isArray(e)) {
        e.forEach(i => count[i]++)
      }
      else {
        count[e]++;
      }
    },
  },
  'row': {
    data: [
      { name: '1', checked: false },
      { name: '2', checked: false },
      { name: '3', checked: false },
      { name: '4', checked: true },
      { name: 'Ex1', checked: true },
      { name: 'Ex2', checked: true },
      { name: '5', checked: true },
    ],
    expand(obj) { return this.data[obj.row].name; },
    show(e) { return this.data[e].checked; },
    add(e, count) { count[e]++; },
  },
  'owned': {
    data: [
      { name: 'Yes', checked: true },
      { name: 'No', checked: true },
    ],
    expand(obj) { return this.data[obj.owned ? 0 : 1].name; },
    show(e) { return this.data[e ? 0 : 1].checked; },
    add(e, count) { count[e ? 0 : 1]++; },
  },
  'ring': {
    data: [
      { name: 'Yes', checked: true },
      { name: 'No', checked: true },
    ],
    expand(obj) { return this.data[obj.ring ? 0 : 1].name; },
    show(e) { return this.data[e ? 0 : 1].checked; },
    add(e, count) { count[e ? 0 : 1]++; },
  },
  'pub': {
    data: [
      { name: 'Yes', checked: true },
      { name: 'No', checked: true },
    ],
    expand(obj) { return this.data[obj.pub ? 0 : 1].name; },
    show(e) { return this.data[e ? 0 : 1].checked; },
    add(e, count) { count[e ? 0 : 1]++; },
  }
}
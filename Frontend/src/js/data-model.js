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
  },
  'ri': {
    data: [
      { name: 'R', checked: false },
      { name: 'SR', checked: false },
      { name: 'SSR', checked: true },
    ],
    expand(obj) { return this.data[obj.ri].name; },
    show(e) { return this.data[e].checked; },
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
    expand(obj) { return this.data[obj.e].name; },
    show(e) { return this.data[e].checked; },
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
  },
  'row': {
    data: [
      { name: '1', checked: false },
      { name: '2', checked: false },
      { name: '3', checked: false },
      { name: '4', checked: true },
      { name: 'Ex1', checked: true },
      { name: 'Ex2', checked: true },
    ],
    expand(obj) { return this.data[obj.row].name; },
    show(e) { return this.data[e].checked; },
  },
  'owned': {
    data: [
      { name: 'Yes', checked: true },
      { name: 'No', checked: true },
    ],
    expand(obj) { return this.data[obj.owned].name; },
    show(e) {
      if (e) {
        return this.data[0].checked;
      }
      return this.data[1].checked;
    },
  },
}
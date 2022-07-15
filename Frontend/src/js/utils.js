'use strict'

const isEmpty = (obj) => {
  return ! obj || (obj instanceof Object && Object.keys(obj).length === 0);
}

// Usage: filterObject(obj, ([key, value]) => value > 1); 
const filterObject = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate));

const copy = (o) => {
  if (o === null) return null;

  let output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
      v = o[key];
      output[key] = (typeof v === "object") ? copy(v) : v;
  }
  return output;
}

const unescapeBase64 = (str) => {
  return (str + '==='.slice((str.length + 3) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/')
}
  
const escapeBase64 = (str) => {
  return str.replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

class LocalStorageMgt {
  constructor(page) {
    this.page = page;
  }
  
  setValue(name, obj) {
    if (typeof name !== "string") {
      throw "name is not a String!"
    }
    localStorage.setItem(this.page + '-' + name, JSON.stringify(obj[name]));
  }

  setNamedValue(name, value) {
    if (typeof name !== "string") {
      throw "name is not a String!"
    }
    localStorage.setItem(this.page + '-' + name, JSON.stringify(value));
  }

  // Only set the value if it exists
  getValue(obj, name) {
    if (typeof name !== "string") {
      throw "name is not a String!"
    }
    const tmpValue = localStorage.getItem(this.page + '-' + name);    
    if (tmpValue) {
      obj[name] = JSON.parse(tmpValue);
    }
  }

  // Return the value without setting data
  fetchValue(name) {
    if (typeof name !== "string") {
      throw "name is not a String!"
    }
    const tmpValue = localStorage.getItem(this.page + '-' + name);    
    if (tmpValue) {
      return JSON.parse(tmpValue);
    }
    return undefined;
  }
}

function getPartyResponse(response) {
  return {
    data: response.data,
    actions: response.data.actions,
    content: response.data.content,
    characters_stars: response.data.characters_stars,
    characters_levels: response.data.characters_levels,
    characters_pluses: response.data.characters_pluses,
    characters_prings: response.data.characters_prings,
    description: response.data.desc,
    isPublic: response.data.isPublic,
    summons_levels: response.data.summons_levels,
    summons_pluses: response.data.summons_pluses,
    summons_stars: response.data.summons_stars,
    weapons_levels: response.data.weapons_levels,
    weapons_pluses: response.data.weapons_pluses,
    weapons_skill_levels: response.data.weapons_skill_levels,
    weapons_skill_names: response.data.weapons_skill_names,
    weapons_stars: response.data.weapons_stars,
  };
}

export default {
  isEmpty,
  filterObject,
  copy,
  unescapeBase64,
  escapeBase64,
  LocalStorageMgt,
  getPartyResponse
}
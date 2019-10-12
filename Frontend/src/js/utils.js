'use strict'

const isEmpty = (obj) => {
  return ! obj || (obj instanceof Object && Object.keys(obj).length === 0);
}

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

export default {
  isEmpty,
  copy,
  unescapeBase64,
  escapeBase64,
  LocalStorageMgt,
}
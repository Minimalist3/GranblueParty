class Unit {
  constructor(name, element) {
    this.name = name;
    this.element = element;
  }
}

const ElementEnum = Object.freeze({
  fire: 'fire', water: 'water', earth: 'earth', wind: 'wind', light: 'light', dark: 'dark'
});

class MaterialStep {
  constructor(name, items) {
    this.name = name;
    this.items = items;
  }
}

export {
  Unit,
  ElementEnum,
  MaterialStep
}
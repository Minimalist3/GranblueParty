import Utils from '@/js/utils'

const ActionType = {
  SKILL: 0,
  SUMMON: 1,
  ATTACK: 2,
}

export default {
  state: {
    percentHP: 100,
    classe: {},
    characters: [{}, {}, {}, {}, {}],
    summons: [{}, {}, {}, {}, {}, {}],
    weapons: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {},],
    actions: [],
  },
  getters: {
    getPercentHP: state => {
      return state.percentHP;
    },
    getClasse: state => {
      return state.classe;
    },
    getCharacters: state => {
      return state.characters;
    },
    getSummons: state => {
      return state.summons;
    },
    getSummonsStats: state => {
      let result = {atk: 0, hp: 0};
      
      // Support summon doesn't count in the sum
      for (let i=0; i<5; i++) {
        const s = state.summons[i];

        if (s.nameen) {
          result.atk += s.atk;
          result.hp += s.hp;

          if (s.level > 1) {
            result.atk += (s.atkmlb - s.atk) / 99 * Math.min(s.level-1, 99);
            result.hp += (s.hpmlb - s.hp) / 99 * Math.min(s.level-1, 99);
          }
          if (s.level > 100) {
            result.atk += (s.atkflb - s.atkmlb) / 50 * Math.min(s.level - 100, 50);
            result.hp += (s.hpflb - s.hpmlb) / 50 * Math.min(s.level - 100, 50);
          }
          if (s.level > 150) {
            result.atk += (s.atkulb - s.atkflb) / 50 * Math.min(s.level - 150, 50);
            result.hp += (s.hpulb - s.hpflb) / 50 * Math.min(s.level - 150, 50);
          }

          result.atk = Math.floor(result.atk);
          result.hp = Math.floor(result.hp);
        }
        if (s.pluses) {
          result.atk += s.pluses * 5;
          result.hp += s.pluses;
        }
      }

      return result;
    },
    getWeapons: state => {
      return state.weapons;
    },
    getActions: state => {
      return state.actions;
    },
    getActionsText: state => {
      let actions = '';
      state.actions.forEach(a => {
        switch (a.type) {
          case ActionType.SUMMON:
            actions += 'Summon ' + a.skillName + '\n';
            break;
          case ActionType.SKILL:
            actions += a.sourceName + ' (' + a.skillSlot + ') ' + a.skillName + '\n';
            break;
          case ActionType.ATTACK:
            actions += 'Attack\n';
            break;
        }
      })
      return actions;
    }
  },
  mutations: {
    setPercentHP(state, value) {
      state.percentHP = Math.min(Math.max(0, value), 100);
    },
    /**
     * Classes
     */
    setClasse(state, value) {
      if ( ! Utils.isEmpty(value)) {
        // Fix default skills
        value.skills.forEach(s => {
          if (s !== null) {
            s['fixed'] = true;
          }
        });
        // MC has 4 skills (ignore row 1 and 2 classes limitation)
        while (value.skills.length < 4) {
          value.skills.push(null);
        }
      }
      state.classe = value;
    },
    setClasseSkill(state, { slot, data }) {
      if (Utils.isEmpty(state.classe.skills[slot]) || ! state.classe.skills[slot].fixed) {
        Vue.set(state.classe.skills, slot, data);
      }
    },
    /**
     * Characters
     */
    setCharacters(state, value) {
      state.characters = value;
    },
    /**
     * Summons
     */
    setSummons(state, value) {
      state.summons = value;
    },
    /**
     * Weapons
     */
    setWeapons(state, value) {
      state.weapons = value;
    },
    /**
     * Actions
     */
    addActionMCSkill(state, index) {
      state.actions.push({
        sourceName: state.classe.nameen,
        sourceSlot: 0,
        skillName: state.classe.skills[index].nameen,
        skillSlot: index + 1,
        type: ActionType.SKILL,
      });
    },
    addActionCharacterSkill(state, { slot, index }) {
      state.actions.push({
        sourceName: state.characters[slot].nameen,
        sourceSlot: slot + 1,
        skillName: state.characters[slot].skills[index].name,
        skillSlot: index + 1,
        type: ActionType.SKILL,
      });
    },
    addActionSummon(state, slot) {
      state.actions.push({
        skillName: state.summons[slot].nameen,
        sourceSlot: slot+1,
        type: ActionType.SUMMON,
      });
    },
    addActionAttack(state) {
      state.actions.push({
        type: ActionType.ATTACK,
      });
    },
    undoAction(state) {
      state.actions.pop();
    },
    clearActions(state) {
      state.actions = [];
    },
  },
  actions: {
    addActions({ commit }, actions) {
      actions.forEach(e => {
        switch(e[2]) {
          case ActionType.SUMMON:
            commit('addActionSummon', e[0]);
            break;
          case ActionType.SKILL:
            if (e[0] < 0) {
              commit('addActionMCSkill', e[1]);
            } else {
              commit('addActionCharacterSkill', { slot: e[0], index: e[1] });
            }              
            break;
          case ActionType.ATTACK:
            commit('addActionAttack');
            break;
        }
      })
    },
  }
}
import Vue from 'vue'

import KeyData from '@/js/key-data'
import Utils from '@/js/utils'
import UtilsParty from '@/js/utils-party'

// Always loaded

const ActionType = {
  SKILL: 0,
  SUMMON: 1,
  ATTACK: 2,
}

const DEFAULT_VALUES = {
  classe: {},
  characters: [{}, {}, {}, {}, {}],
  summons: [{}, {}, {}, {}, {}, {}, {}, {}],
  weapons: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
}

const INITIAL_DATA = () => {
  return {
    percent_HP: 100,
    // Duplicated in components/Parties.vue
    ... Utils.copy(DEFAULT_VALUES),
    weapons_skills: [[], [], [], [], [], [], [], [], [], [], [], [], []],
    actions: [],
    party_mode: 1, // = $MODE.Edit
    content: null,
    party_name: "",
    video_id: null,
    isPublic: false,
    liked: false,
    description: '',
    current_party: null,
    team_owner: null,
    show_bookmarklet: false,
    show_update_bookmarklet: false,
  }
}

// Helper to match categories with proper default values
const getDefaultValues = (data, category) => {
  if (Utils.isEmpty(data[category])) {
    return Utils.copy(DEFAULT_VALUES[category]);
  }
  if (data[category] instanceof Array) {          
    return data[category].map(e => Utils.isEmpty(e) ? {} : e);
  }
  return data[category];
};

export default {
  state() {
    return INITIAL_DATA();
  },
  getters: {
    getWeaponsCurrentData: state => {
      return state.weapons_skills.map(w => w.flatMap(s => s.data ? [s.data] : []));
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
    },
  },
  mutations: {
    resetParty(state) {
      Object.assign(state, INITIAL_DATA());
    },
    setPercentHP(state, value) {
      state.percent_HP = Math.min(Math.max(0, value), 100);
    },
    setShowBookmarklet(state, value) {
      state.show_bookmarklet = value;
    },
    setShowUpdateBookmarklet(state, value) {
      state.show_update_bookmarklet = value;
    },
    setPartyMode(state, value) {
      state.party_mode = value;
    },
    setContent(state, value) {
      state.content = value;
      if (value === null) {
        state.isPublic = false;
      }
    },
    setPartyName(state, value) {
      state.party_name = value;
    },
    setCurrentParty(state, value) {
      state.current_party = value;
    },
    setVideoId(state, value) {
      state.video_id = value;
    },
    setPublic(state, value) {
      state.isPublic = value;
    },
    setLiked(state, value) {
      state.liked = value;
    },
    setDescription(state, value) {
      state.description = value;
    },
    setTeamOwner(state, value) {
      state.team_owner = value;
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
      Vue.set(state, 'classe', value);
    },
    setClasseSkill(state, { slot, data }) {
      if (Utils.isEmpty(state.classe.skills[slot]) || ! state.classe.skills[slot].fixed) {
        Vue.set(state.classe.skills, slot, data);
      }
    },
    /**
     * Characters
     */
    setCharacter(state, { index, data }) {
      if ( ! Utils.isEmpty(data)) {
        if (data.level === undefined) {
          Vue.set(data, 'level', UtilsParty.getCharacterLevel(data));
        }
        if (data.pluses === undefined) {
          Vue.set(data, 'pluses', 0);
        }
        if (data.haspring === undefined) {
          Vue.set(data, 'haspring', false);
        }
      }

      Vue.set(state.characters, index, data);
    },
    /**
     * Summons
     */
    setSummon(state, { index, data }) {
      if ( ! Utils.isEmpty(data)) {
        if (data.level === undefined) {
          Vue.set(data, 'level', UtilsParty.getSummonLevel(data));
        }
        if (data.pluses === undefined) {
          Vue.set(data, 'pluses', 0);
        }
        UtilsParty.setSummonCurrentData(data);
      }

      Vue.set(state.summons, index, data);
    },
    /**
     * Weapons
     */
    setWeapon(state, { index, data }) {
      if ( ! Utils.isEmpty(data)) {
        if (data.level === undefined) {
          Vue.set(data, 'level', UtilsParty.getWeaponLevel(data));
        }
        if (data.sklevel === undefined) {
          Vue.set(data, 'sklevel', UtilsParty.getWeaponSkillLevel(data));
        }
        if (data.pluses === undefined) {
          Vue.set(data, 'pluses', 0);
        }
        if (data.keys === undefined) {
          Vue.set(data, 'keys', [null, null, null]);
        }
      }
      else if (index === 0) {
        state.isPublic = false;
      }

      Vue.set(state.weapons, index, data);
      Vue.set(state.weapons_skills, index, []);
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
    setCharacters({ commit }, value) {
      for (let i=0; i<value.length; i++) {
        commit('setCharacter', { index: i, data: value[i] });
      }
    },
    setSummons({ commit }, value) {
      for (let i=0; i<value.length; i++) {
        commit('setSummon', { index: i, data: value[i] });
      }
    },
    setWeapons({ commit }, value) {
      for (let i=0; i<value.length; i++) {
        commit('setWeapon', { index: i, data: value[i] });
      }
    },
    addActions({ commit }, actions) {
      actions.forEach(e => {
        if (e && e.length >= 3) {
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
        }
      })
    },
    loadParty(
      { state, dispatch, commit },
      { data = null, actions = null, content = null, isPublic = false, description = '', party_mode = 1,
        characters_levels = null, characters_stars = null, characters_pluses = null, characters_prings = null,
        summons_levels = null, summons_stars = null, summons_pluses = null,
        weapons_levels = null, weapons_stars = null, weapons_pluses = null, weapons_skill_levels = null, weapons_skill_names = null} = {}
    ) {
      // Clear current party
      commit('resetParty');

      commit('setPartyName', data.n ? data.n : "");
      commit('setPartyMode', party_mode);

      if (data.userid && data.id) {
        commit('setTeamOwner', data.userid);
        commit('setCurrentParty', data.id);
      }

      commit('setClasse', getDefaultValues(data, 'classe'));
      
      if ( ! Utils.isEmpty(data['class_skills']) && ! Utils.isEmpty(state.classe)) {
        data['class_skills'].forEach((e, slot) => {
          commit('setClasseSkill', {slot: slot, data: e});
        });
      }
      dispatch('setCharacters', getDefaultValues(data, 'characters'));
      dispatch('setSummons', getDefaultValues(data, 'summons'));
      dispatch('setWeapons', getDefaultValues(data, 'weapons'));

      // Set stars
      if (characters_stars) {
        for (let i=0; i<state.characters.length && i<characters_stars.length; i++) {
          if (characters_stars[i] !== null) {
            Vue.set(state.characters[i], 'stars', characters_stars[i]);
          }
        }
      }
      else if (characters_levels) {
        for (let i=0; i<state.characters.length && i<characters_levels.length; i++) {
          if (characters_levels[i] === null) {
            continue;
          }
          let lvl = parseInt(characters_levels[i], 10);
          if (lvl > 80) {
            Vue.set(state.characters[i], 'stars', 5);
          }
          else if (lvl > 60) {
            Vue.set(state.characters[i], 'stars', 4);
          }
          else if (lvl > 40) {
            Vue.set(state.characters[i], 'stars', 3);
          }
          else if (lvl > 20) {
            Vue.set(state.characters[i], 'stars', 2);
          }
          else if (lvl > 1) {
            Vue.set(state.characters[i], 'stars', 1);
          }
          else {
            Vue.set(state.characters[i], 'stars', 0);
          }
        }
      }
      if (characters_levels) {
        for (let i=0; i<state.characters.length && i<characters_levels.length; i++) {
          if (characters_levels[i] !== null) {
            Vue.set(state.characters[i], 'level', characters_levels[i]);
          }
        }
      }
      if (characters_pluses) {
        for (let i=0; i<state.characters.length && i<characters_pluses.length; i++) {
          if (characters_pluses[i] !== null) {
            Vue.set(state.characters[i], 'pluses', characters_pluses[i]);
          }
        }
      }
      if (characters_prings) {
        for (let i=0; i<state.characters.length && i<characters_prings.length; i++) {
          if (characters_prings[i] !== null) {
            Vue.set(state.characters[i], 'haspring', characters_prings[i]);
          }
        }
      }

      if (summons_stars) {
        for (let i=0; i<state.summons.length && i<summons_stars.length; i++) {
          if (summons_stars[i] !== null) {
            Vue.set(state.summons[i], 'stars', summons_stars[i]);
          }
        }
      }
      if (summons_levels) {
        for (let i=0; i<state.summons.length && i<summons_levels.length; i++) {
          if (summons_levels[i] !== null) {
            Vue.set(state.summons[i], 'level', summons_levels[i]);
          }
        }
      }
      if (summons_pluses) {
        for (let i=0; i<state.summons.length && i<summons_pluses.length; i++) {
          if (summons_pluses[i] !== null) {
            Vue.set(state.summons[i], 'pluses', summons_pluses[i]);
          }
        }
      }

      if (weapons_stars) {
        for (let i=0; i<state.weapons.length && i<weapons_stars.length; i++) {
          if (weapons_stars[i] !== null) {
            Vue.set(state.weapons[i], 'stars', weapons_stars[i]);
          }
        }
      }
      else if (weapons_skill_levels) {
        for (let i=0; i<state.weapons.length && i<weapons_skill_levels.length; i++) {
          let sl = parseInt(weapons_skill_levels[i], 10);
          if (sl > 15) {
            Vue.set(state.weapons[i], 'stars', 5);
          }
          else if (sl > 10) {
            Vue.set(state.weapons[i], 'stars', 4);
          }
          else if (sl > 1) {
            Vue.set(state.weapons[i], 'stars', 3);
          }
          // SL1 means Special Skill with no SL
        }
      }
      if (weapons_skill_levels) {
        for (let i=0; i<state.weapons.length && i<weapons_skill_levels.length; i++) {
          if (weapons_skill_levels[i] !== null) {
            Vue.set(state.weapons[i], 'sklevel', weapons_skill_levels[i]);
          }
        }
      }
      if (weapons_levels) {
        for (let i=0; i<state.weapons.length && i<weapons_levels.length; i++) {
          if (weapons_levels[i] !== null) {
            Vue.set(state.weapons[i], 'level', weapons_levels[i]);
          }
        }
      }
      if (weapons_pluses) {
        for (let i=0; i<state.weapons.length && i<weapons_pluses.length; i++) {
          if (weapons_pluses[i] !== null) {
            Vue.set(state.weapons[i], 'pluses', weapons_pluses[i]);
          }
        }
      }
      if (weapons_skill_names) {
        for (let i=0; i<state.weapons.length && i<weapons_skill_names.length; i++) {
          if (weapons_skill_names[i]) {
            Vue.set(state.weapons[i], 'keys', [null, null, null]);

            for (let j=0; j<weapons_skill_names[i].length; j++) {
              // Only add keys for weapon skills that support them
              if (weapons_skill_names[i][j] && state.weapons[i].skills[j] && state.weapons[i].skills[j][0] && state.weapons[i].skills[j][0].keyid) {
                Vue.set(state.weapons[i].keys, j, KeyData.getSkillByName(weapons_skill_names[i][j].trim()));
              }
            }
          }
        }
      }

      if ( ! Utils.isEmpty(actions)) {
        dispatch('addActions', actions);
      }

      if (data.video) {
        commit('setVideoId', data.video);
      }

      state.content = content;
      state.isPublic = isPublic;
      state.liked = data.l ? true : false;
      commit('setDescription', description);
    }
  }
}
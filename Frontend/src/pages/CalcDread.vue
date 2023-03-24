<template>
  <div class="flex flex-col flex-wrap items-center">
    <h1 class="mb-8">Dread Barrage Calculator</h1>

    <!-- Stats -->
    <div class="flex flex-col gap-x-4">
      <span class="flex flex-row flex-wrap items-center gap-4">
        <label>Boxes needed <input class="input input-sm" type="number" min="1" style="width: 7ch;" v-model.lazy="boxes_needed"></label>
        <label>Already opened <input class="input input-sm" type="number" min="0" style="width: 7ch;" v-model.lazy="boxes_opened"></label>
      </span>

      <span class="flex flex-row flex-wrap items-center gap-4">
        <label>Tokens obtained <input class="input input-sm" type="number" min="0" style="width: 10ch;" v-model.lazy="tokens_obtained"></label>
        <span>Progress: {{ getProgress }}%</span>
      </span>
    </div>
    <div class="flex flex-col gap-x-4 mb-8">
      <span>{{ tokens_explained }}</span>
      <span class="text-lg font-bold">Tokens needed: {{ tokens_needed }}</span>
    </div>

    <!-- Time calc -->
    <h2 class="mb-4">Farming time calculator (input in seconds):</h2>

    <div class="overflow-y-auto w-full">
      <table class="table bg-secondary table-px w-auto ml-auto mr-auto mb-8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Total</th>
            <th>Tokens/hour</th>
            <th>AP/hour</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Loading</td>
            <td><input class="input input-sm" type="number" min="0" style="width: 7ch;" v-model.lazy="time_loading"></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr v-for="(fight, index) in getFights" :key="index">
            <td>{{ fight.name }}</td>
            <td><input class="input input-sm" type="number" min="1" style="width: 7ch;" v-model.lazy="time_fight[index]"></td>
            <td>{{ fight.total_time }}</td>
            <td>{{ fight.token_per_hour }}</td>
            <td>{{ fight.ap_per_hour }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Select fights -->
    <div class="flex flex-row flex-wrap items-center gap-4">
      <span class="flex flex-row flex-wrap btn-group items-center">
        <span class="mr-2">Fight</span>
        <button
          v-for="(fight, index) in getFightNames"
          :key="index"
          class="btn btn-sm"
          :class="show_fight[index] ? 'btn-blue' : 'btn-white'"
          @click="showFight(index)"
        >
          {{ fight }}
        </button>
      </span>
      
      <span class="flex flex-row flex-wrap btn-group items-center">
        <span class="mr-2">Type</span>
        <button class="btn btn-sm" :class="show_host ? 'btn-blue' : 'btn-white'" @click="show_host = ! show_host">
          Host
        </button>
        <button class="btn btn-sm" :class="show_join ? 'btn-blue' : 'btn-white'" @click="show_join = ! show_join">
          Join
        </button>
      </span>
    </div>

    <div class="flex flex-row flex-wrap mb-4 items-center gap-4">
      Show results for
      <checkbox v-model="show_result_2nd" class="ordinal">2nd</checkbox>
      <checkbox v-model="show_result_3rd" class="ordinal">3rd</checkbox>
      <checkbox v-model="show_result_other">Other</checkbox>
    </div>

    <!-- Table -->
    <div class="overflow-y-auto w-full">
      <table class="table table-striped bg-secondary table-px w-auto ml-auto mr-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th v-if="show_host && show_join"></th>
            <th v-if="show_result_2nd || show_result_3rd || show_result_other"></th>
            <th>Tokens</th>
            <th v-if="show_host">Tokens/AP</th>
            <th v-if="show_join">Tokens/EP</th>
            <th>Fights</th>
            <th v-if="show_host">Pots</th>
            <th v-if="show_join">Berries</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in getData" :key="index">
            <td :rowspan="data.name_rows" class="is-td-vcentered bg-secondary" v-if="data.name">{{ data.name }}</td>
            <td :rowspan="data.type_rows" class="is-td-vcentered bg-secondary" v-if="data.type && show_host && show_join">{{ data.type }}</td>
            <td v-if="show_result_2nd || show_result_3rd || show_result_other">{{ data.finish }}</td>
            <td>{{ data.token }}</td>
            <td v-if="show_host">{{ (data.cost_ap ? (data.token / data.cost_ap).toFixed(2) : '') }}</td>
            <td v-if="show_join">{{ (data.cost_ep ? (data.token / data.cost_ep).toFixed(2) : '') }}</td>
            <td>{{ Math.ceil(tokens_needed / data.token) }}</td>
            <td v-if="show_host">{{ data.cost_ap > 0 ? Math.ceil(tokens_needed / data.token * (data.cost_ap / 75) ) : '' }}</td>
            <td v-if="show_join">{{ data.cost_ep > 0 ? Math.ceil(tokens_needed / data.token * data.cost_ep ) : '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Utils from '@/js/utils.js'

import Checkbox from '@/components/common/Checkbox.vue'

const lsMgt = new Utils.LocalStorageMgt('CalcDread');

const FIGHT_DATA = [
  {
    name: '1★',
    cost_ap: 20,
    cost_ep: 2,
    honor: 320,
    token_host: 18,
    token_join: 20,
    token_1: 14,
    token_2: 0,
    token_3: 0
  },
  {
    name: '2★',
    cost_ap: 30,
    cost_ep: 2,
    honor: 788,
    token_host: 28,
    token_join: 22,
    token_1: 20,
    token_2: 0,
    token_3: 0
  },
  {
    name: '3★',
    cost_ap: 40,
    cost_ep: 2,
    honor: 3730,
    token_host: 50,
    token_join: 25,
    token_1: 22,
    token_2: 15,
    token_3: 8
  },
  {
    name: '4★',
    cost_ap: 50,
    cost_ep: 3,
    honor: 20330,
    token_host: 72,
    token_join: 40,
    token_1: 34,
    token_2: 26,
    token_3: 18
  },
  {
    name: '5★',
    cost_ap: 50,
    cost_ep: 3,
    honor: 410000,
    token_host: 115,
    token_join: 80,
    token_1: 48,
    token_2: 40,
    token_3: 28
  },
  {
    name: 'Lvl 95',
    cost_ap: 0,
    cost_ep: 3,
    honor: 11855,
    token_host: 55,
    token_join: 30,
    token_1: 26,
    token_2: 18,
    token_3: 10
  },
  {
    name: 'Lvl 135',
    cost_ap: 0,
    cost_ep: 3,
    honor: 11855,
    token_host: 100,
    token_join: 60,
    token_1: 44,
    token_2: 34,
    token_3: 24
  },
  {
    name: 'Lvl 175',
    cost_ap: 0,
    cost_ep: 3,
    honor: 75000,
    token_host: 160,
    token_join: 110,
    token_1: 68,
    token_2: 54,
    token_3: 38
  },
];

export default {
  components: {
    Checkbox
  },
  head: {
    title: 'Granblue.Party - Dread Barrage Calculator',
    desc: 'Calculator for Dread Barrage tokens',
    image: 'https://www.granblue.party/img/card_index.jpg',
    keywords: 'Granblue Fantasy, GBF, Dread Barrage, tokens, eternals, valor badge'
  },
  data() {
    return {
      boxes_needed: 20,
      boxes_opened: 0,
      tokens_explained: '',
      tokens_obtained: 0,
      tokens_total: 0,
      show_fight: [false, true, true, true, true, true, true, true],
      time_loading: 1,
      time_fight: [0, 0, 0, 0, 0],
      show_host: true,
      show_join: true,
      show_result_2nd: false,
      show_result_3rd: false,
      show_result_other: true,
    }
  },
  methods: {
    showFight(index) {
      this.$set(this.show_fight, index, ! this.show_fight[index]);
    },
    getFightData(fight) {
      let result = [];

      const nb_rows = 1 +
        ((fight.token_2 > 0 && this.show_result_2nd) ? 1 : 0) +
        ((fight.token_3 > 0 && this.show_result_3rd) ? 1 : 0) +
        (this.show_result_other ? 1 : 0);

      // Host
      if (this.show_host) {
        result.push({
          type: 'Host',
          type_rows: nb_rows,
          finish: 'MVP',
          token: fight.token_host + fight.token_join + fight.token_1,
          cost_ap: fight.cost_ap,
        })
        if (fight.token_2 > 0 && this.show_result_2nd) {
          result.push({
            finish: '2nd',
            token: fight.token_host + fight.token_join + fight.token_2,
            cost_ap: fight.cost_ap,
          })
        }
        if (fight.token_3 > 0 && this.show_result_3rd) {
          result.push({
            finish: '3rd',
            token: fight.token_host + fight.token_join + fight.token_3,
            cost_ap: fight.cost_ap,
          })
        }
        if (this.show_result_other) {
          result.push({
            finish: '',
            token: fight.token_host + fight.token_join,
            cost_ap: fight.cost_ap,
          })
        }
      }

      // Join
      if (this.show_join) {
        result.push({
          type: 'Join',
          type_rows: nb_rows,
          finish: 'MVP',
          token: fight.token_join + fight.token_1,
          cost_ep: fight.cost_ep,
        })
        if (fight.token_2 > 0 && this.show_result_2nd) {
          result.push({
            finish: '2nd',
            token: fight.token_join + fight.token_2,
            cost_ep: fight.cost_ep,
          })
        }
        if (fight.token_3 > 0 && this.show_result_3rd) {
          result.push({
            finish: '3rd',
            token: fight.token_join + fight.token_3,
            cost_ep: fight.cost_ep,
          })
        }
        if (this.show_result_other) {
          result.push({
            finish: '',
            token: fight.token_join,
            cost_ep: fight.cost_ep,
          })
        }
      }

      if (result.length > 0) {
        result[0].name = fight.name;
        result[0].name_rows = nb_rows * (this.show_host && this.show_join ? 2 : 1);
      }

      return result;
    },
    getFightTime(fight, index) {
      const time_fight = parseInt(this.time_fight[index], 10);
      const time_loading = parseInt(this.time_loading, 10);

      if (time_fight < 1) {
        return "";
      }
      const token_per_fight = fight.token_host + fight.token_join + fight.token_1;
      const time = Math.ceil(this.tokens_needed / token_per_fight) * (time_fight + time_loading);
      const token_per_hour = Math.ceil(3600 * this.tokens_needed / time);
      const ap_per_hour = Math.ceil(3600 * (this.tokens_needed / token_per_fight * (fight.cost_ap)) / time);

      return {
        total_time: Utils.toReadableTime(time),
        token_per_hour: token_per_hour,
        ap_per_hour: ap_per_hour
      };
    }
  },
  computed: {
    getData() {
      return FIGHT_DATA.flatMap((f, index) => {
        if (this.show_fight[index]) {
          return this.getFightData(f);
        }
        return [];
      });
    },
    getFights() {
      return FIGHT_DATA
        .slice(0, 5)
        .map((f, index) => {
          return {
            name: f.name,
            ...this.getFightTime(f, index)
          }          
        });
    },
    getFightNames() {
      return FIGHT_DATA.map(f => f.name);
    },
    getBoxesNeeded() {
      return parseInt(this.boxes_needed, 10)
    },
    getBoxesOpened() {
      return parseInt(this.boxes_opened, 10)
    },
    getTokensObtained() {
      return parseInt(this.tokens_obtained, 10)
    },
    getProgress() {
      let result = (100 - (this.tokens_needed / this.tokens_total * 100)).toFixed(2);
      if (this.tokens_total == 0) {        
        return (100).toFixed(2);
      }
      return result;
    },
    tokens_needed() {
      let tokens = 0;
      let boxes = this.getBoxesNeeded - this.getBoxesOpened;
      this.tokens_explained = '';
      if (boxes ===  1) {
        this.tokens_explained = boxes + ' box = (';
      }
      else if (boxes > 1) {
        this.tokens_explained = boxes + ' boxes = (';
      }
      let add_plus = false;

      // Box 1 (1 box): 800 tickets * 2 per draw
      if (this.getBoxesOpened === 0 && boxes > 0) {
        tokens += 1600;
        boxes--;
        this.tokens_explained += '1600';
        add_plus = true;
      }
      // Box 2 to 4 (3 boxes): 1202 tickets * 2 per draw
      if (this.getBoxesOpened < 4 && boxes > 0) {
        const sum = Math.min(3, boxes, 4-this.getBoxesOpened);
        tokens += 2404 * sum;
        boxes -= sum;
        this.tokens_explained += (add_plus ? ' + ' : '') + sum + 'x2404';
        add_plus = true;
      }
      // Box 5 to 20 (16 boxes): 1000 tickets * 2 per draw
      if (this.getBoxesOpened < 20 && boxes > 0) {
        const sum = Math.min(16, boxes, 20-this.getBoxesOpened);
        tokens += 2000 * sum;
        boxes -= sum;
        this.tokens_explained += (add_plus ? ' + ' : '') + sum + 'x2000';
        add_plus = true;
      }
      // Box 21 to 40 (20 boxes): 2500 tickets * 4 per draw
      if (this.getBoxesOpened < 40 && boxes > 0) {
        const sum = Math.min(20, boxes, 40-this.getBoxesOpened);
        tokens += 10000 * sum;
        boxes -= sum;
        this.tokens_explained += (add_plus ? ' + ' : '') + sum + 'x10000';
        add_plus = true;
      }
      // Box 41+: 2500 tickets * 6 per draw
      if (boxes > 0) {
        tokens += 15000 * boxes;
        this.tokens_explained += (add_plus ? ' + ' : '') + boxes + 'x15000';
      }

      this.tokens_total = tokens;
      if (this.tokens_explained) {
        this.tokens_explained += ' tokens)';
      }

      if (this.getTokensObtained > 0) {
        tokens -= this.getTokensObtained;
        if (this.tokens_total > 0) {
          this.tokens_explained += ' - ' + this.getTokensObtained;
          if (this.getTokensObtained > 1) {
            this.tokens_explained += ' tokens obtained';
          }
          else {
            this.tokens_explained += ' token obtained';
          }
        }
      }
      
      return Math.max(0, tokens);
    }
  },
  watch: {
    show_fight() {
      lsMgt.setValue('show_fight', this);
    },
    show_host() {
      lsMgt.setValue('show_host', this);
    },
    show_join() {
      lsMgt.setValue('show_join', this);
    },
    tokens_obtained() {
      lsMgt.setValue('tokens_obtained', this);
    },
    boxes_needed() {
      lsMgt.setValue('boxes_needed', this);
    },
    boxes_opened() {
      lsMgt.setValue('boxes_opened', this);
    },
    show_result_2nd() {
      lsMgt.setValue('show_result_2nd', this);
    },
    show_result_3rd() {
      lsMgt.setValue('show_result_3rd', this);
    },
    show_result_other() {
      lsMgt.setValue('show_result_other', this);
    },
    time_loading() {
      lsMgt.setValue('time_loading', this);
    },
    time_fight() {
      lsMgt.setValue('time_fight', this);
    },
  },
  mounted() {
    lsMgt.getValue(this, 'show_fight');
    lsMgt.getValue(this, 'show_host');
    lsMgt.getValue(this, 'show_join');
    lsMgt.getValue(this, 'boxes_needed');
    lsMgt.getValue(this, 'boxes_opened');
    lsMgt.getValue(this, 'tokens_obtained');
    lsMgt.getValue(this, 'show_result_2nd');
    lsMgt.getValue(this, 'show_result_3rd');
    lsMgt.getValue(this, 'show_result_other');
    lsMgt.getValue(this, 'time_loading');
    lsMgt.getValue(this, 'time_fight');
  },
};
</script>
<template>
  <div class="flex flex-col items-center">
    <h1 class="mb-8">Guild Wars tokens and boxes Calculator</h1>

    <!-- Stats -->
    <div class="flex flex-col gap-x-4">
      <span class="flex flex-row flex-wrap items-center gap-4">
        <label>Boxes needed <input class="input input-sm" type="number" min="1" style="width: 7ch;" v-model.lazy="boxes_needed"></label>
        <label>Already opened <input class="input input-sm" type="number" min="0" style="width: 7ch;" v-model.lazy="boxes_opened"></label>
        <span>Progress: {{ getProgress }}%</span>
      </span>

      <span class="flex flex-row flex-wrap items-center gap-4">
        <label>Tokens obtained <input class="input input-sm" type="number" min="0" style="width: 10ch;" v-model.lazy="tokens_obtained"></label>
        <span>
          <label>Total honor <input class="input input-sm" type="number" min="0" style="width: 14ch;" v-model.lazy="total_honor"></label>
          {{ total_honor >= 1000000 ? '(&asymp;' + (total_honor / 1000000).toFixed(2) + 'm)' : '' }}
        </span>
      </span>
    </div>
    <div class="flex flex-col mb-8 gap-x-4">
      <span>{{ tokens_explained }}</span>
      <span class="text-lg font-bold">Tokens needed: {{ tokens_needed }}</span>
    </div>

    <!-- Time calc -->
    <h2 class="mb-4">Farming time calculator (input in seconds):</h2>

    <div class="overflow-y-auto w-full">
      <table class="table bg-secondary table-px w-auto ml-auto mr-auto mb-4">
        <thead>
          <tr>
            <th><abbr title="Percentage of tokens coming from this raid">%</abbr></th>
            <th>Name</th>
            <th>Time/fight</th>
            <th>Fights</th>
            <th>Tokens</th>
            <th>Honor</th>
            <th>Time</th>
            <th>Pots</th>
            <th>Meat/fight</th>
            <th>Meat</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>
              <dropdown v-model.number="chosen_ex">
                <option v-for="(fight, index) in getExFights" :key="index" :value="index">{{ fight.name }}</option>
              </dropdown>
            </td>
            <td><input class="input input-sm" type="number" min="1" style="width: 7ch;" v-model.lazy="time_fight_ex[chosen_ex]"></td>
            <td>{{ getExFights[chosen_ex].fights }}</td>
            <td>{{ getExFights[chosen_ex].tokens }}</td>
            <td>{{ getExFights[chosen_ex].honor }}</td>
            <td>{{ getExFights[chosen_ex].time }}</td>
            <td>{{ Math.ceil(getExFights[chosen_ex].pots) }}</td>
            <td><input class="input input-sm" type="number" min="1" step=".5" style="width: 7ch;" v-model.lazy.number="meat_fight[chosen_ex]"></td>
            <td>{{ getExFights[chosen_ex].meat }}</td>
          </tr>
          <tr v-for="(fight, index) in getRaidFights" :key="index">
            <td><input class="input input-sm" type="number" min="0" max="100" style="width: 7ch;" v-model.lazy.number="quota_fight_raid[index]"></td>
            <td>{{ fight.name }}</td>
            <td><input class="input input-sm" type="number" min="1" style="width: 7ch;" v-model.lazy.number="time_fight_raid[index]"></td>
            <td>{{ quota_fight_raid[index] > 0 ? fight.fights : '' }}</td>
            <td>{{ quota_fight_raid[index] > 0 ? fight.tokens : '' }}</td>
            <td>{{ quota_fight_raid[index] > 0 ? fight.honor : '' }}</td>
            <td>{{ quota_fight_raid[index] > 0 ? fight.time : '' }}</td>
            <td>{{ quota_fight_raid[index] > 0 ? fight.pots : '' }}</td>
            <td></td>
            <td>{{ quota_fight_raid[index] > 0 ? fight.meat : '' }}</td>
          </tr>
          <tr>
            <td></td>
            <td><b>Total</b></td>
            <td></td>
            <td>{{ getTotalFights.fights }}</td>
            <td>{{ getTotalFights.tokens }}</td>
            <td>{{ getTotalFights.honor }}</td>
            <td>{{ getTotalFights.time }}</td>
            <td>{{ Math.ceil(getTotalFights.pots) }}</td>
            <td></td>
            <td>{{ getTotalFights.meat }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mb-8">
      <h3 v-if="getTotalQuota != 100" class="text-rose-600">
        The sum of all % must be 100
      </h3>
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

      <checkbox v-model="add_honor">Include honor to tokens sum</checkbox>
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
            <th>Solo honor</th>
            <th v-if="show_host && show_join"></th>
            <th v-if="show_result_2nd || show_result_3rd || show_result_other"></th>
            <th>Tokens</th>
            <th v-if="show_host">Tokens/AP</th>
            <th v-if="show_host">Tokens/meat</th>
            <th v-if="show_join">Tokens/EP</th>
            <th>Fights</th>
            <th v-if="show_host">Meats</th>
            <th v-if="show_host">Pots</th>
            <th v-if="show_join">Berries</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in getData" :key="index">
            <td :rowspan="data.name_rows" class="is-td-vcentered bg-secondary" v-if="data.name">{{ data.name }}</td>
            <td :rowspan="data.honor_rows" class="is-td-vcentered bg-secondary" v-if="data.honor">{{ data.honor }}</td>
            <td :rowspan="data.type_rows" class="is-td-vcentered bg-secondary" v-if="data.type && show_host && show_join">{{ data.type }}</td>
            <td v-if="show_result_2nd || show_result_3rd || show_result_other">{{ data.finish }}</td>
            <td>{{ data.token }}</td>
            <td v-if="show_host">{{ (data.cost_ap ? (data.token / data.cost_ap).toFixed(2) : '') }}</td>
            <td v-if="show_host">{{ (data.cost_meat ? (data.token / data.cost_meat).toFixed(2) : '') }}</td>
            <td v-if="show_join">{{ (data.cost_ep ? (data.token / data.cost_ep).toFixed(2) : '') }}</td>
            <td>{{ Math.ceil(tokens_needed / data.token) }}</td>
            <td v-if="show_host">{{ data.cost_meat > 0 ? Math.ceil(tokens_needed / data.token * data.cost_meat ) : '' }}</td>
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
import Dropdown from '@/components/common/Dropdown.vue'

const lsMgt = new Utils.LocalStorageMgt('CalcGW');

const FIGHT_DATA = [
  {
    name: 'Ex',
    cost_ap: 30,
    cost_meat: 0,
    cost_ep: 1,
    honor: 51000,
    token_host: 22,
    token_join: 20,
    token_1: 14,
    token_2: 0,
    token_3: 0
  },
  {
    name: 'Ex+',
    cost_ap: 30,
    cost_meat: 0,
    cost_ep: 1,
    honor: 80800,
    token_host: 26,
    token_join: 20,
    token_1: 20,
    token_2: 0,
    token_3: 0
  },
  {
    name: 'NM 90',
    cost_ap: 30,
    cost_meat: 5,
    cost_ep: 2,
    honor: 260000,
    token_host: 45,
    token_join: 20,
    token_1: 18,
    token_2: 10,
    token_3: 5
  },
  {
    name: 'NM 95',
    cost_ap: 40,
    cost_meat: 10,
    cost_ep: 3,
    honor: 910000,
    token_host: 55,
    token_join: 30,
    token_1: 26,
    token_2: 18,
    token_3: 10
  },
  {
    name: 'NM 100',
    cost_ap: 50,
    cost_meat: 20,
    cost_ep: 3,
    honor: 2650000,
    token_host: 80,
    token_join: 48,
    token_1: 40,
    token_2: 30,
    token_3: 20
  },
  {
    name: 'NM 150',
    cost_ap: 50,
    cost_meat: 20,
    cost_ep: 3,
    honor: 4100000,
    token_host: 120,
    token_join: 85,
    token_1: 52,
    token_2: 42,
    token_3: 30
  },
  {
    name: 'NM 200',
    cost_ap: 50,
    cost_meat: 20,
    cost_ep: 3,
    honor: 10250000,
    token_host: 160,
    token_join: 110,
    token_1: 68,
    token_2: 0,
    token_3: 0
  },
];

export default {
  components: {
    Checkbox,
    Dropdown
  },
  head: {
    title: 'Granblue.Party - Guild Wars Tokens Calculator',
    desc: 'Calculator for Guild Wars tokens and boxes',
    image: 'https://www.granblue.party/img/card_calcgw.jpg',
    keywords: 'Guild Wars, GW, Unite and Fight, U&F, 40 boxes, calculator, eternals, meat, gold bar'
  },
  data() {
    return {
      boxes_needed: 40,
      boxes_opened: 0,
      total_honor: 0,
      tokens_explained: '',
      tokens_obtained: 0,
      tokens_total: 0,
      show_fight: [false, true, true, true, true, true, true],
      time_fight_ex: [15, 15],
      time_fight_raid: [30, 120, 300, 300, 420],
      quota_fight_raid: [0, 40, 0, 30, 30],
      meat_fight: [5, 6.5],
      chosen_ex: 1,
      show_host: true,
      show_join: true,
      add_honor: false,
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
          token: fight.token_host + fight.token_join + fight.token_1 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
          cost_ap: fight.cost_ap,
          cost_meat: fight.cost_meat,
        })
        if (fight.token_2 > 0 && this.show_result_2nd) {
          result.push({
            finish: '2nd',
            token: fight.token_host + fight.token_join + fight.token_2 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
            cost_ap: fight.cost_ap,
            cost_meat: fight.cost_meat,
          })
        }
        if (fight.token_3 > 0 && this.show_result_3rd) {
          result.push({
            finish: '3rd',
            token: fight.token_host + fight.token_join + fight.token_3 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
            cost_ap: fight.cost_ap,
            cost_meat: fight.cost_meat,
          })
        }
        if (this.show_result_other) {
          result.push({
            finish: '',
            token: fight.token_host + fight.token_join + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
            cost_ap: fight.cost_ap,
            cost_meat: fight.cost_meat,
          })
        }
      }

      // Join
      if (this.show_join) {
        result.push({
          type: 'Join',
          type_rows: nb_rows,
          finish: 'MVP',
          token: fight.token_join + fight.token_1 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
          cost_ep: fight.cost_ep,
        })
        if (fight.token_2 > 0 && this.show_result_2nd) {
          result.push({
            finish: '2nd',
            token: fight.token_join + fight.token_2 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
            cost_ep: fight.cost_ep,
          })
        }
        if (fight.token_3 > 0 && this.show_result_3rd) {
          result.push({
            finish: '3rd',
            token: fight.token_join + fight.token_3 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
            cost_ep: fight.cost_ep,
          })
        }
        if (this.show_result_other) {
          result.push({
            finish: '',
            token: fight.token_join + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
            cost_ep: fight.cost_ep,
          })
        }
      }

      if (result.length > 0) {
        result[0].name = fight.name;
        result[0].name_rows = nb_rows * (this.show_host && this.show_join ? 2 : 1);
        result[0].honor = fight.honor;
        result[0].honor_rows = nb_rows * (this.show_host && this.show_join ? 2 : 1);
      }

      return result;
    },
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
    getTotalHonor() {
      return parseInt(this.total_honor, 10)
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
      // Box 2 to 4 (3 boxes): 1200 tickets * 2 per draw
      if (this.getBoxesOpened < 4 && boxes > 0) {
        const sum = Math.min(3, boxes, 4-this.getBoxesOpened);
        tokens += 2400 * sum;
        boxes -= sum;
        this.tokens_explained += (add_plus ? ' + ' : '') + sum + 'x2400';
        add_plus = true;
      }
      // Box 5 to 45 (41 boxes): 2000 tickets * 2 per draw
      if (this.getBoxesOpened < 45 && boxes > 0) {
        const sum = Math.min(41, boxes, 45-this.getBoxesOpened);
        tokens += 2000 * sum;
        boxes -= sum;
        this.tokens_explained += (add_plus ? ' + ' : '') + sum + 'x2000';
        add_plus = true;
      }
      // Box 46 to 80 (35 boxes): 2500 tickets * 4 per draw
      if (this.getBoxesOpened < 80 && boxes > 0) {
        const sum = Math.min(35, boxes, 80-this.getBoxesOpened);
        tokens += 10000 * sum;
        boxes -= sum;
        this.tokens_explained += (add_plus ? ' + ' : '') + sum + 'x10000';
        add_plus = true;
      }
      // Box 81+: 2500 tickets * 6 per draw
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

      const honor_tokens = Math.floor(this.getTotalHonor * 60 / 1000000);
      if (honor_tokens > 0) {
        tokens -= honor_tokens;
        if (this.tokens_total > 0) {
          this.tokens_explained += ' - ' + honor_tokens;
          if (honor_tokens > 1) {
            this.tokens_explained += ' final rally tokens';
          }
          else {
            this.tokens_explained += ' final rally token';
          }
        }
      }
      
      return Math.max(0, tokens);
    },
    // Farming time calculator
    getExFights() {
      return this.getAllFights.slice(0, 2);
    },
    getRaidFights() {
      return this.getAllFights.slice(2, FIGHT_DATA.length);
    },
    getTotalFights() {
      return this.getAllFights[this.getAllFights.length - 1];
    },
    getTotalQuota() {
      return this.quota_fight_raid.reduce((acc, val) => acc + val);
    },
    getAllFights() {
      let result = FIGHT_DATA.map(f => {
          return {
            name: f.name,
            fights: 0,
            meat: 0,
            tokens: 0,
            honor: 0,
            time: 0,
            pots: 0
          }     
        });
      result.push({
        name: "Total",
        fights: 0,
        meat: 0,
        tokens: 0,
        honor: 0,
        time: 0,
        pots: 0
      });

      let total_tokens = this.tokens_needed;
      const chosen_ex = FIGHT_DATA[this.chosen_ex];

      for (let i=0; i<FIGHT_DATA.length - 2; i++) {
        if (this.quota_fight_raid[i] === 0) {
          result[i+2].fights = 0;
          continue;
        }

        const raid = FIGHT_DATA[i+2];
        const tokens_from_one_raid =  raid.token_host + raid.token_join + raid.token_1 + raid.honor * 60 / 1000000;
        const ex_per_raid = raid.cost_meat / this.meat_fight[this.chosen_ex]; 
        const tokens_from_one_ex = chosen_ex.token_host + chosen_ex.token_join + chosen_ex.token_1 + chosen_ex.honor * 60 / 1000000;
        const tokens_from_one_group = tokens_from_one_raid + ex_per_raid * tokens_from_one_ex;
        const number_of_groups = Math.ceil((total_tokens / tokens_from_one_group) * (this.quota_fight_raid[i] / 100));
        const number_of_ex = Math.ceil(number_of_groups * ex_per_raid);

        result[i+2].fights = number_of_groups;
        result[i+2].meat = - raid.cost_meat * number_of_groups;
        result[i+2].tokens = Math.floor(tokens_from_one_raid * number_of_groups);
        result[i+2].honor = Math.floor(raid.honor * number_of_groups);
        result[i+2].time = this.time_fight_raid[i] * number_of_groups;
        result[i+2].pots = Math.ceil(raid.cost_ap * number_of_groups / 75);

        result[this.chosen_ex].fights += number_of_ex;
        result[this.chosen_ex].meat += this.meat_fight[this.chosen_ex] * number_of_ex;
        result[this.chosen_ex].tokens += Math.floor(tokens_from_one_ex * number_of_ex);
        result[this.chosen_ex].honor += Math.floor(chosen_ex.honor * number_of_ex);
        result[this.chosen_ex].time += this.time_fight_ex[this.chosen_ex] * number_of_ex;
        result[this.chosen_ex].pots += chosen_ex.cost_ap * number_of_ex / 75;
      }

      for (let i=0; i<FIGHT_DATA.length; i++) {
        result[result.length-1].fights += result[i].fights;
        result[result.length-1].meat += result[i].meat;
        result[result.length-1].tokens += result[i].tokens;
        result[result.length-1].honor += result[i].honor;
        result[result.length-1].time += result[i].time;
        result[result.length-1].pots += result[i].pots;

        if (result[i].honor >= 1000000) {
          result[i].honor = (result[i].honor / 1000000).toFixed(2) + 'm';
        }
        result[i].time = Utils.toReadableTime(result[i].time);
      }
      if (result[result.length-1].honor >= 1000000) {
        result[result.length-1].honor = (result[result.length-1].honor / 1000000).toFixed(2) + 'm';
      }
      result[result.length-1].time = Utils.toReadableTime(result[result.length-1].time);

      return result;
    }
  },
  watch: {
    boxes_needed() {
      lsMgt.setValue('boxes_needed', this);
    },
    boxes_opened() {
      lsMgt.setValue('boxes_opened', this);
    },
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
    total_honor() {
      lsMgt.setValue('total_honor', this);
    },
    add_honor() {
      lsMgt.setValue('add_honor', this);
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
    time_fight_ex() {
      lsMgt.setValue('time_fight_ex', this);
    },
    time_fight_raid() {
      lsMgt.setValue('time_fight_raid', this);
    },
    quota_fight_raid() {
      lsMgt.setValue('quota_fight_raid', this);
    },
    meat_fight() {
      lsMgt.setValue('meat_fight', this);
    },
    chosen_ex() {
      lsMgt.setValue('chosen_ex', this);
    },
  },
  mounted() {
    lsMgt.getValue(this, 'boxes_needed');
    lsMgt.getValue(this, 'boxes_opened');
    lsMgt.getValue(this, 'show_fight');
    lsMgt.getValue(this, 'show_host');
    lsMgt.getValue(this, 'show_join');
    lsMgt.getValue(this, 'tokens_obtained');
    lsMgt.getValue(this, 'total_honor');
    lsMgt.getValue(this, 'add_honor');
    lsMgt.getValue(this, 'show_result_2nd');
    lsMgt.getValue(this, 'show_result_3rd');
    lsMgt.getValue(this, 'show_result_other');
    lsMgt.getValue(this, 'time_fight_ex');
    lsMgt.getValue(this, 'time_fight_raid');
    lsMgt.getValue(this, 'quota_fight_raid');
    lsMgt.getValue(this, 'meat_fight');
    lsMgt.getValue(this, 'chosen_ex');
  },
}
</script>
<template>
  <div class="flex flex-col items-center">
    <h1 class="mb-8">New Event tokens Calculator</h1>

    <!-- Stats -->
    <div class="flex flex-col mb-8">
      <span class="flex flex-row flex-wrap items-center">
        <label class="mr-4">Boxes needed <input class="input input-sm" type="number" min="1" style="width: 7ch;" v-model.lazy="boxes_needed"></label>
        <label class="mr-4">Already opened <input class="input input-sm" type="number" min="0" style="width: 7ch;" v-model.lazy="boxes_opened"></label>
        <span>Progress: {{ getProgress }}%</span>
      </span>

      <span class="flex flex-row flex-wrap items-center">
        <label class="mr-4">Tokens obtained <input class="input input-sm" type="number" min="0" style="width: 10ch;" v-model.lazy="tokens_obtained"></label>
      </span>

      <span>
        A Nightmare fight appears on average once every <input class="input input-sm" type="number" min="0" style="width: 5ch;" v-model.lazy="nightmare_rate"> raids
      </span>

      <span>{{ tokens_explained }}</span>
      <span class="text-lg font-bold">Tokens needed: {{ tokens_needed }}</span>
    </div>

    <!-- Select fights -->
    <div class="flex flex-row flex-wrap mb-4 items-center">
      <span class="mr-4 inline-flex flex-row btn-group">
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
      
      <span class="inline-flex flex-row mr-4 btn-group">
        <span class="mr-2">Type</span>
        <button class="btn btn-sm" :class="show_host ? 'btn-blue' : 'btn-white'" @click="show_host = ! show_host">
          Host
        </button>
        <button class="btn btn-sm" :class="show_join ? 'btn-blue' : 'btn-white'" @click="show_join = ! show_join">
          Join
        </button>
      </span>

      <checkbox v-model="add_nightmare">Include Nightmare tokens to sum</checkbox>
    </div>

    <!-- Table -->
    <div class="overflow-y-auto w-full">
      <table class="table table-striped table-px w-auto ml-auto mr-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
            <th></th>
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
            <td :rowspan="data.name_rows" class="is-td-vcentered" v-if="data.name">{{ data.name }}</td>
            <td :rowspan="data.type_rows" class="is-td-vcentered" v-if="data.type">{{ data.type }}</td>
            <td>{{ data.finish }}</td>
            <td>{{ +data.token.toFixed(2) }}</td>
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

    <span class="pt-4">
      <h2>Additional information</h2>
      <ul class="list-disc ml-4">
        <li>You might need up to 14 additional tokens for carried over Damascus Crystals in boxes 4 to 10</li>
        <li>Each daily mission gives an additional 200 tokens</li>
        <li>Nightmare quest can only appear after raids you've hosted</li>
      </ul>
    </span>
  </div>
</template>

<script>
import Utils from '@/js/utils.js'

import Checkbox from '@/components/common/Checkbox.vue'

const lsMgt = new Utils.LocalStorageMgt('CalcEvent');

const FIGHT_DATA = [
  {
    name: 'Very Hard',
    cost_ap: 20,
    cost_meat: 0,
    cost_ep: 1,
    token_host: 6,
    token_join: 11,
    token_1: 6,
  },
  {
    name: 'Extreme',
    cost_ap: 30,
    cost_meat: 3,
    cost_ep: 3,
    token_host: 20,
    token_join: 16,
    token_1: 12,
  },
  {
    name: 'Impossible',
    cost_ap: 40,
    cost_meat: 5,
    cost_ep: 3,
    token_host: 44,
    token_join: 28,
    token_1: 24,
  }
];

export default {
  components: {
    Checkbox
  },
  head: {
    title: 'Granblue.Party - New Event Calculator',
    desc: 'Calculator for new Event tokens and boxes',
    image: 'https://www.granblue.party/img/preview_calcevent.png',
    keywords: 'Event, boxes, tokens, Token Draw, calculator, crystals'
  },
  data() {
    return {
      boxes_needed: 20,
      boxes_opened: 0,
      tokens_explained: '',
      tokens_obtained: 0,
      tokens_total: 0,
      nightmare_rate: 4,
      show_fight: [true, true, true],
      show_host: true,
      show_join: true,
      add_nightmare: false,
    }
  },
methods: {
    showFight(index) {
      this.$set(this.show_fight, index, ! this.show_fight[index]);
    },
    getFightData(fight) {
      let result = [];

      // Host
      if (this.show_host) {
        result.push({
          name: fight.name,
          name_rows: 4 / (this.show_join ? 1 : 2),
          honor: fight.honor,
          honor_rows: 4 / (this.show_join ? 1 : 2),
          type: 'Host',
          type_rows: 2,
          finish: 'MVP',
          token: fight.token_host + fight.token_join + fight.token_1 + (this.add_nightmare ? this.getNightmareEarn : 0),
          cost_ap: fight.cost_ap,
          cost_meat: fight.cost_meat,
        })
        result.push({
          finish: '',
          token: fight.token_host + fight.token_join + (this.add_nightmare ? this.getNightmareEarn : 0),
          cost_ap: fight.cost_ap,
          cost_meat: fight.cost_meat,
        })
      }

      // Join
      if (this.show_join) {
        result.push({
          type: 'Join',
          type_rows: 2,
          finish: 'MVP',
          token: fight.token_join + fight.token_1,
          cost_ep: fight.cost_ep,
        })
        if ( ! this.show_host) {
          result[result.length-1].name = fight.name;
          result[result.length-1].name_rows = 2;
        }
        result.push({
          finish: '',
          token: fight.token_join,
          cost_ep: fight.cost_ep,
        })
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
    getProgress() {
      let result = (100 - (this.tokens_needed / this.tokens_total * 100)).toFixed(2);
      if (this.tokens_total == 0) {        
        return (100).toFixed(2);
      }
      return result;
    },
    getNightmareEarn() {
      if (this.nightmare_rate < 1) {
        return 0;
      }
      return 100 / this.nightmare_rate;
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

      if (this.getBoxesOpened === 0 && boxes > 0) {
        tokens += 1198;
        boxes--;
        this.tokens_explained += '1198';
        add_plus = true;
      }
      if (this.getBoxesOpened < 2 && boxes > 0) {
        tokens += 1598;
        boxes--;
        this.tokens_explained += (add_plus ? ' + ' : '') + '1598';
        add_plus = true;
      }
      if (this.getBoxesOpened < 3 && boxes > 0) {
        tokens += 1998;
        boxes--;
        this.tokens_explained += (add_plus ? ' + ' : '') + '1998';
        add_plus = true;
      }
      if (this.getBoxesOpened < 20 && boxes > 0) {
        const sum = Math.min(17, boxes, 20-this.getBoxesOpened);
        tokens += 2110 * sum;
        boxes -= sum;
        this.tokens_explained += (add_plus ? ' + ' : '') + sum + 'x2110';
        add_plus = true;
      }
      if (boxes > 0) {
        tokens += 2104 * boxes;
        this.tokens_explained += (add_plus ? ' + ' : '') + boxes + 'x2104';
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
    nightmare_rate() {
      lsMgt.setValue('nightmare_rate', this);
    },
    add_nightmare() {
      lsMgt.setValue('add_nightmare', this);
    }
  },
  mounted() {
    lsMgt.getValue(this, 'boxes_needed');
    lsMgt.getValue(this, 'boxes_opened');
    lsMgt.getValue(this, 'show_fight');
    lsMgt.getValue(this, 'show_host');
    lsMgt.getValue(this, 'show_join');
    lsMgt.getValue(this, 'tokens_obtained');
    lsMgt.getValue(this, 'nightmare_rate');
    lsMgt.getValue(this, 'add_nightmare');
  },
}
</script>
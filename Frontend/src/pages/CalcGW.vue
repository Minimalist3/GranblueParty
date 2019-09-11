<template>
  <div>
    <h1 class="title has-text-white">Guild Wars tokens and boxes Calculator</h1>
    <div class="form">
      <label>Boxes needed <input class="input is-small" type="number" min="1" style="width: 10ch;" v-model.lazy="boxes_needed"></label>
      &nbsp;
      <label>Already opened <input class="input is-small" type="number" min="0" style="width: 10ch;" v-model.lazy="boxes_opened"></label>
      &nbsp;
      <label>Total AP <input class="input is-small" type="number" min="1" style="width: 10ch;" v-model.lazy="total_ap"></label>
      <br>
      Tokens needed: {{ tokens_needed }} [{{ tokens_explained }}]
      <br>
      Progress: {{ (100 - (tokens_needed / tokens_total * 100)).toFixed(2) }}%
      <br>
      <label>Tokens obtained <input class="input is-small" type="number" min="0" style="width: 15ch;" v-model.lazy="tokens_obtained"></label>
      &nbsp;
      <label>Total honor <input class="input is-small" type="number" min="0" style="width: 20ch;" v-model.lazy="total_honor"></label>
      {{ total_honor >= 1000000 ? '(approximately ' + (total_honor / 1000000).toFixed(2) + 'm)' : '' }}
    </div>
    <br>

    <div class="field is-grouped is-grouped-multiline">
      <div class="field has-addons">
        Fight&nbsp;
        <button
          v-for="(fight, index) in getFightNames"
          :key="index"
          class="button is-small"
          :class="{'is-info': show_fight[index]}"
          @click="showFight(index)"
        >
          {{ fight }}
        </button>
      </div>
      &nbsp;
      <div class="field has-addons">
        Type&nbsp;
        <button
          class="button is-small"
          :class="{'is-info': show_host}"
          @click="show_host = ! show_host"
        >
          Host
        </button>        
        <button
          class="button is-small"
          :class="{'is-info': show_join}"
          @click="show_join = ! show_join"
        >
          Join
        </button>
      </div>
      &nbsp;
      <div class="field">
        <input class="switch is-rounded is-info is-rtl" type="checkbox" id="addHonor" v-model="add_honor">
        <label for="addHonor">Include honor to tokens sum</label>
      </div>
    </div>
    <br>

    <div class="table-container">
      <table class="table is-hoverable is-striped is-bordered ">
        <thead>
          <tr>
            <th>Name</th>
            <th>Solo honor</th>
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
            <td :rowspan="data.honor_rows" class="is-td-vcentered" v-if="data.honor">{{ data.honor }}</td>
            <td :rowspan="data.type_rows" class="is-td-vcentered" v-if="data.type">{{ data.type }}</td>
            <td>{{ data.finish }}</td>
            <td>{{ data.token }}</td>
            <td v-if="show_host">{{ (data.cost_ap ? (data.token / data.cost_ap).toFixed(2) : '') }}</td>
            <td v-if="show_host">{{ (data.cost_meat ? (data.token / data.cost_meat).toFixed(2) : '') }}</td>
            <td v-if="show_join">{{ (data.cost_ep ? (data.token / data.cost_ep).toFixed(2) : '') }}</td>
            <td>{{ Math.ceil(tokens_needed / data.token) }}</td>
            <td v-if="show_host">{{ data.cost_meat > 0 ? Math.ceil(tokens_needed / data.token * data.cost_meat ) : '' }}</td>
            <td v-if="show_host">{{ data.cost_ap > 0 ? Math.ceil(tokens_needed / data.token * (data.cost_ap / Math.floor(total_ap / 2)) ) : '' }}</td>
            <td v-if="show_join">{{ data.cost_ep > 0 ? Math.ceil(tokens_needed / data.token * data.cost_ep ) : '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Utils from '@/js/utils.js'

const lsMgt = new Utils.LocalStorageMgt('CalcGW');

const fight_data = [
  {
    name: 'Very Hard',
    cost_ap: 30,
    cost_meat: 0,
    cost_ep: 1,
    honor: 21000,
    token_host: 16,
    token_join: 18,
    token_1: 10,
    token_2: 0,
    token_3: 0
  },
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
    honor: 72000,
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
];

export default {
  data() {
    return {
      boxes_needed: 40,
      boxes_opened: 0,
      total_ap: 120,
      total_honor: 0,
      tokens_explained: '',
      tokens_obtained: 0,
      tokens_total: 0,
      show_fight: [false, true, true, true, true, true],
      show_host: true,
      show_join: true,
      add_honor: false,
    }
  },
  methods: {
    showFight(index) {
      Vue.set(this.show_fight, index, ! this.show_fight[index]);
    },
    getFightData(fight) {
      let result = [];

      // Host
      if (this.show_host) {
        result.push({
          name: fight.name,
          name_rows: (4 + (fight.token_2 > 0 ? 2 : 0) + (fight.token_3 > 0 ? 2 : 0)) / (this.show_join ? 1 : 2),
          honor: fight.honor,
          honor_rows: (4 + (fight.token_2 > 0 ? 2 : 0) + (fight.token_3 > 0 ? 2 : 0)) / (this.show_join ? 1 : 2),
          type: 'Host',
          type_rows: 2 + (fight.token_2 > 0 ? 1 : 0) + (fight.token_3 > 0 ? 1 : 0),
          finish: 'MVP',
          token: fight.token_host + fight.token_join + fight.token_1 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
          cost_ap: fight.cost_ap,
          cost_meat: fight.cost_meat,
        })
        if (fight.token_2 > 0) {
          result.push({
            finish: '2nd',
            token: fight.token_host + fight.token_join + fight.token_2 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
            cost_ap: fight.cost_ap,
            cost_meat: fight.cost_meat,
          })
        }
        if (fight.token_3 > 0) {
          result.push({
            finish: '3rd',
            token: fight.token_host + fight.token_join + fight.token_3 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
            cost_ap: fight.cost_ap,
            cost_meat: fight.cost_meat,
          })
        }
        result.push({
          finish: '',
          token: fight.token_host + fight.token_join + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
          cost_ap: fight.cost_ap,
          cost_meat: fight.cost_meat,
        })
      }

      // Join
      if (this.show_join) {
        result.push({
          type: 'Join',
          type_rows: 2 + (fight.token_2 > 0 ? 1 : 0) + (fight.token_3 > 0 ? 1 : 0),
          finish: 'MVP',
          token: fight.token_join + fight.token_1 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
          cost_ep: fight.cost_ep,
        })
        if ( ! this.show_host) {
          result[result.length-1].name = fight.name;
          result[result.length-1].name_rows = (4 + (fight.token_2 > 0 ? 2 : 0) + (fight.token_3 > 0 ? 2 : 0)) / 2;
          result[result.length-1].honor = fight.honor;
          result[result.length-1].honor_rows = (4 + (fight.token_2 > 0 ? 2 : 0) + (fight.token_3 > 0 ? 2 : 0)) / 2;
        }
        if (fight.token_2 > 0) {
          result.push({
            finish: '2nd',
            token: fight.token_join + fight.token_2 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
            cost_ep: fight.cost_ep,
          })
        }
        if (fight.token_3 > 0) {
          result.push({
            finish: '3rd',
            token: fight.token_join + fight.token_3 + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
            cost_ep: fight.cost_ep,
          })
        }
        result.push({
          finish: '',
          token: fight.token_join + (this.add_honor ? fight.honor * 60 / 1000000 : 0),
          cost_ep: fight.cost_ep,
        })
      }

      return result;
    },
  },
  computed: {
    getData() {
      return fight_data.flatMap((f, index) => {
        if (this.show_fight[index]) {
          return this.getFightData(f);
        }
        return [];
      });
    },
    getFightNames() {
      return fight_data.map(f => f.name);
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
    tokens_needed() {
      let tokens = 0;
      let boxes = this.getBoxesNeeded - this.getBoxesOpened;
      this.tokens_explained = '';
      if (boxes ===  1) {
        this.tokens_explained = boxes + ' box (';
      }
      else if (boxes > 1) {
        this.tokens_explained = boxes + ' boxes (';
      }
      let add_plus = false;

      if (this.getBoxesOpened === 0 && boxes > 0) {
        tokens += 1600;
        boxes--;
        this.tokens_explained += '1600';
        add_plus = true;
      }      
      if (this.getBoxesOpened < 4 && boxes > 0) {
        const sum = Math.min(3, boxes, 4-this.getBoxesOpened);
        tokens += 2400 * sum;
        boxes -= sum;
        this.tokens_explained += (add_plus ? ' + ' : '') + sum + 'x2400';
        add_plus = true;
      }      
      if (this.getBoxesOpened < 44 && boxes > 0) {
        const sum = Math.min(40, boxes, 44-this.getBoxesOpened);
        tokens += 2000 * sum;
        boxes -= sum;
        this.tokens_explained += (add_plus ? ' + ' : '') + sum + 'x2000';
        add_plus = true;
      }
      if (boxes > 0) {
        tokens += 6000 * boxes;
        this.tokens_explained += (add_plus ? ' + ' : '') + boxes + 'x6000';
      }
      this.tokens_total = tokens;
      if (this.tokens_explained) {
        this.tokens_explained += ' tokens)';
      }

      if (this.getTokensObtained > 0) {
        tokens -= this.getTokensObtained;
        this.tokens_explained += ' - ' + this.getTokensObtained;
        if (this.getTokensObtained > 1) {
          this.tokens_explained += ' tokens obtained';
        }
        else {
          this.tokens_explained += ' token obtained';
        }
      }

      const honor_tokens = Math.floor(this.getTotalHonor * 60 / 1000000);
      if (honor_tokens > 0) {
        tokens -= honor_tokens;
        this.tokens_explained += ' - ' + honor_tokens;
        if (honor_tokens > 1) {
          this.tokens_explained += ' final rally tokens';
        }
        else {
          this.tokens_explained += ' final rally token';
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
    total_ap() {
      lsMgt.setValue('total_ap', this);
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
  },
  created() {
    lsMgt.getValue(this, 'boxes_needed');
    lsMgt.getValue(this, 'boxes_opened');
    lsMgt.getValue(this, 'total_ap');
    lsMgt.getValue(this, 'show_fight');
    lsMgt.getValue(this, 'show_host');
    lsMgt.getValue(this, 'show_join');
    lsMgt.getValue(this, 'tokens_obtained');
    lsMgt.getValue(this, 'total_honor');
    lsMgt.getValue(this, 'add_honor');
  },
}
</script>

<style scoped>

.is-td-vcentered {
  vertical-align: middle;
  text-align: center;
}

</style>
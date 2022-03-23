import DataModel from '@/js/data-model.js'
import Utils from '@/js/utils.js'

const mixin = (categories, lsMgt) => {
  function getDataModel() {
    // Copy the data model locally to modify "checked" properties
    return Object.fromEntries(categories.map(c => [c.key, Utils.copy(DataModel[c.key])]));  
  }
  
  return {
    data() {
      return {
        case_sensitive: false,
        whole_word: false,
        data_model: getDataModel(),
        data: null,
        index: 0,
        slice_size: 10,
        results: [],
      }
    },
    methods: {
      search() {
        let expression = this.$refs.searchfield.value;
        if (this.whole_word) {
          expression =  '\\b' + expression + '\\b';
        }
        const expression_length = this.$refs.searchfield.value.length;
        
        // Reset the results
        this.results = [];
        this.index = 0;
        if (this.data === null) {
          return;
        }
        if (expression_length === 0) {
          return;
        }
  
        let flags = '';
        if (this.case_sensitive === false) {
          flags += 'i';
        }
        const re = new RegExp(expression, flags);

        this.search_impl(re);
      },  
      highlight(text, highlight = true) {
        if (highlight === false) {
          return text;
        }

        let expression = this.$refs.searchfield.value;
        if (this.whole_word) {
          expression =  '\\b' + expression + '\\b';
        }
        const expression_length = this.$refs.searchfield.value.length;
        let flags = 'g';
        if (this.case_sensitive === false) {
          flags += 'i';
        }
        const re = new RegExp(expression, flags);
        const res_split = text.split(re);

        let result = res_split[0];
        let size = result.length;
        for (let i=1; i < res_split.length; i++) {
          result += '<span class="bg-inverse text-inverse">' + text.slice(size, size + expression_length) + '</span>' + res_split[i];
          size += res_split[i].length + expression_length;
        }

        return result;
      },
      getResultsSlice() {
        if (this.index * this.slice_size > this.getResults.length) {
          this.index = 0;
        }
        return this.getResults.slice(this.index * this.slice_size, this.index * this.slice_size + this.slice_size);
      },
      changeSlice(i) {
        this.index = i-1;
        location.hash = "#results";
      },
      hasData(arr) {
        return arr !== null && arr.some(a => a !== null);
      },
    },
    computed: {
      getFilters() {
        return categories.filter(c => { return c.isFilter });
      },
      getResults() {
        return this.results.filter(item => {
          return this.getFilters.every(f => this.data_model[f.key].show(item[f.key]));
        });
      }
    },
    watch: {
      case_sensitive() {
        lsMgt.setValue('case_sensitive', this);
      },
      whole_word() {
        lsMgt.setValue('whole_word', this);
      },
    },
    mounted() {
      lsMgt.getValue(this, 'case_sensitive');
      lsMgt.getValue(this, 'whole_word');
  
      this.$nextTick().then(() => {
        this.$refs.searchfield.focus();
      });
    }
  };
};

export default mixin;
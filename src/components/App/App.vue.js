import { select } from 'd3-selection';
import { mapMutations } from 'vuex';

import DffPlot from '@/components/DffPlot';
import RoiPlot from '@/components/RoiPlot';

export default {
  name: 'app',
  components: {
    DffPlot,
    RoiPlot
  },
  props: {
    width: Number,
    height: Number
  },
  watch: {
    mode: function (mode) {
      this.setMode(mode);
    },

    timeIndex (val) {
      this.setTimeIndex(val);
    }
  },
  methods: {
    ...mapMutations({
      setMode: 'mode',
      setTimeIndex: 'timeIndex'
    })
  },
  data () {
    return {
      mode: 'selection',
      timeIndex: 0,
    };
  },
  mounted () {
    select('#clear')
      .on('click', () => {
        this.$store.commit('focus', []);
      });
  }
}

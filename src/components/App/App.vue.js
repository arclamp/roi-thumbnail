import { select } from 'd3-selection';

import DffPlot from '@/components/DffPlot';
import ROIPlot from '@/components/ROIPlot';

export default {
  name: 'app',
  components: {
    DffPlot,
    ROIPlot
  },
  watch: {
    mode: function (mode) {
      this.$store.commit('mode', mode);
    },

    timeIndex (val) {
      this.$store.commit('timeIndex', val);
    }
  },
  data () {
    return {
      mode: 'selection',
      timeIndex: 0
    };
  },
  mounted () {
    select('#clear')
      .on('click', () => {
        this.$store.commit('focus', []);
      });
  }
}

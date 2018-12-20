import { select } from 'd3-selection';
import { mapMutations } from 'vuex';

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
      width: 1024,
      height: 512
    };
  },
  mounted () {
    select('#clear')
      .on('click', () => {
        this.$store.commit('focus', []);
      });
  }
}

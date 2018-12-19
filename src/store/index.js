import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    roiPlot: {
      width: 0,
      height: 0
    },
    rois: [],
    dff: [],
    epochs: [],
    focus: [],
    timeIndex: 0,
    mode: 'selection'
  },
  mutations: {
    setData (state, { which, data }) {
      state[which] = data;
    },

    setROISize (state, dim) {
      state.roiPlot.width = dim.width;
      state.roiPlot.height = dim.height;
    },

    focus (state, which) {
      state.focus = which;
    },

    toggle (state, which) {
      const focus = state.focus;

      // Copy the focus elements over if they do not match the target; this
      // will toggle that element off if it is current in focus.
      let out = [];
      focus.forEach(d => {
        if (d !== which) {
          out.push(d);
        }
      });

      // If the output length is the same as the input length, then the
      // element wasn't found and we must therefore turn it on.
      if (out.length === focus.length) {
        out.push(which);
      }

      state.focus = out;
    },

    mode (state, mode) {
      state.mode = mode;
    },

    timeIndex (state, val) {
      state.timeIndex = val;
    }
  }
});

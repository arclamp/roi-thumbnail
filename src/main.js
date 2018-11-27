import Vue from 'vue';
import Vuex from 'vuex';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(Vuex);

async function json (url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function main () {
  const store = new Vuex.Store({
    state: {
      roiPlot: {
        width: 0,
        height: 0
      },
      rois: [],
      dff: [],
      epochs: [],
      focus: null,
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

      mode (state, mode) {
        state.mode = mode;
      },

      timeIndex (state, val) {
        state.timeIndex = val;
      }
    }
  });

  // Grab the ROIs and Dff data parallel-asynchronously.
  const roisReq = json('data/rois.json');
  const dffReq = json('data/dff.json');
  const epochReq = json('data/stim_epoch.json');
  const [rois, dff, epochs] = [await roisReq, await dffReq, await epochReq];

  store.commit('setROISize', {
    width: 512,
    height: 512
  });

  store.commit('setData', {
    which: 'rois',
    data: rois
  });

  store.commit('setData', {
    which: 'dff',
    data: dff
  });

  store.commit('setData', {
    which: 'epochs',
    data: epochs
  });

  new Vue({
    store,
    render: h => h(App),
  }).$mount('#app')
}

main();

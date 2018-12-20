import Vue from 'vue';

import App from '@/components/App';
import { store } from './store';

Vue.config.productionTip = false;

async function json (url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function main () {
  // Grab the ROIs and Dff data parallel-asynchronously.
  const roisReq = json('data/rois.json');
  const dffReq = json('data/dff.json');
  const epochReq = json('data/stim_epoch.json');
  const [rois, dff, epochs] = [await roisReq, await dffReq, await epochReq];

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

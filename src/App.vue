<template>
  <div id="app">
    <DffPlot />
    <ROIPlot />

    <input type="radio" id="selection" value="selection" v-model="mode">
    <label for="selection">Selection Mode</label>
    <br>
    <input type="radio" id="time" value="time" v-model="mode">
    <label for="time">Time Mode</label>
    <br>
    <div v-if="mode === 'time'">
      <input type="range" id="timeindex" min="0" max="2001" v-model="timeIndex">
      <br>
      <span>Time index: {{ Math.floor(timeIndex * 56.8025987006) }}</span>
    </div>

  </div>
</template>

<script>
import DffPlot from '@/components/DffPlot';
import ROIPlot from '@/components/ROIPlot'

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
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

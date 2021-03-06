<template>
  <div style="float:left;">
    <canvas v-bind:width="width" v-bind:height="height" v-on:click="click"></canvas>
  </div>
</template>

<script>
import { scalePow } from 'd3-scale';

import CanvasImage from './CanvasImage';
import { minmax } from '@/util';

export default {
  name: 'ROIPlot',
  computed: {
    width () {
      return this.$store.state.roiPlot.width;
    },

    height () {
      return this.$store.state.roiPlot.height;
    },

    rois () {
      return this.$store.state.rois;
    },

    dff () {
      return this.$store.state.dff;
    },

    dffRange () {
      const dff = this.dff;
      return minmax(dff);
    },

    timeIndex () {
      return this.$store.state.timeIndex;
    },

    focus () {
      return this.$store.state.focus;
    },

    mode () {
      return this.$store.state.mode;
    }
  },
  watch: {
    focus (newFocus, oldFocus) {
      this.setFocus(newFocus, oldFocus);
    },

    mode (mode) {
      this.img.clear(0, 0, 0, 255);

      if (mode === 'selection') {
        this.drawSelectionROIs();
        this.setFocus(this.focus, []);
      } else {
        this.setFocus([], this.focus);
        this.drawIntensityROIs();
      }

      this.img.update();
    },

    timeIndex () {
      this.drawIntensityROIs();
      this.img.update();
    }
  },
  mounted () {
    const el = this.$el;
    const canvas = el.getElementsByTagName('canvas')[0];

    this.img = new CanvasImage(canvas, {
      width: this.width,
      height: this.height
    });

    this.img.clear(0, 0, 0, 255);
    this.drawSelectionROIs();

    this.img.update();

    const range = this.dffRange;
    this.intensity = scalePow()
      .domain(range)
      .range([0, 255])
      .exponent(0.4);
  },

  methods: {
    drawROI (which, color, update) {
      const rois = this.rois;
      for (let j = 0; j < rois[which].length; j++) {
        this.img.setPixel(rois[which][j][0], rois[which][j][1], {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a,
          update: false
        });
      }

      if (update) {
        this.img.update();
      }
    },

    drawSelectionROIs () {
      const rois = this.rois;
      for (let i = 0; i < rois.length; i++) {
        const color = i < 50 ? { r: 100, g: 100, b: 100 } : { r: 50, g: 50, b: 50 };
        this.drawROI(i, color, false);
      }
    },

    drawSelectionROI (which, focused) {
      const focusColor = { r: 0, g: 255, b: 0 };
      const brightColor = { r: 100, g: 100, b: 100 };
      const darkColor = { r: 50, g: 50, b: 50 };

      const color = focused ? focusColor : (which < 50 ? brightColor : darkColor);

      this.drawROI(which, color, false);
    },

    drawIntensityROIs () {
      const dff = this.dff;
      const timeIndex = this.timeIndex;
      const focus = this.focus;
      for (let i = 0; i < 50; i++) {
        const focused = focus.indexOf(i) > -1;
        this.drawIntensityROI(i, dff[i][timeIndex], focused);
      }
    },

    drawIntensityROI (which, value, focused) {
      const color = this.intensity(value);
      this.drawROI(which, {
        r: focused ? 0 : color,
        g: color,
        b: focused ? 0 : color,
      }, false);
    },

    setFocus (newFocus, oldFocus) {
      const mode = this.mode;
      const dff = this.dff;
      const timeIndex = this.timeIndex;
      oldFocus.forEach(d => {
        if (mode === 'selection') {
          this.drawSelectionROI(d, false);
        } else {
          this.drawIntensityROI(d, dff[d][timeIndex], false);
        }
      });

      newFocus.forEach(d => {
        if (mode === 'selection') {
          this.drawSelectionROI(d, true);
        } else {
          this.drawIntensityROI(d, dff[d][timeIndex], true);
        }
      });

      this.img.update();
    },

    click () {
      // Time out here to give canvas element a chance to pick up the mouse
      // click and record its coordinates.
      window.setTimeout(() => {
        const mouse = this.img.click;

        // Find a match.
        const rois = this.rois;
        let i;
loop:
        for (i = 0; i < rois.length; i++) {
          for (let j = 0; j < rois[i].length; j++) {
            if (rois[i][j][0] === mouse.x && rois[i][j][1] === mouse.y) {
              break loop;
            }
          }
        }

        if (i < 50) {
          this.$store.commit('toggle', i);
        }
      }, 0);
    }
  }
}
</script>

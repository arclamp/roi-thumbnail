<template>
  <div style="float:left;">
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"></svg>
  </div>
</template>

<script>
import { minmax } from '@/util';

import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemePastel1 } from 'd3-scale-chromatic';
import { line as d3line } from 'd3-shape';

export default {
  name: 'DffPlot',
  computed: {
    dff () {
      return this.$store.state.dff;
    },
    focus () {
      return this.$store.state.focus;
    },
    epochs () {
      const raw = this.$store.state.epochs;
      let data = [];
      for (let idx in Object.keys(raw.stimulus)) {
        data.push({
          stimulus: raw.stimulus[idx],
          start: raw.start[idx],
          end: raw.end[idx]
        });
      }

      const scale = this.dff[0].length / data[data.length - 1].end;
      for (let i = 0; i < data.length; i++) {
        data[i].start *= scale;
        data[i].end *= scale;
      }

      return data;
    },
    mode () {
      return this.$store.state.mode;
    },
    timeIndex () {
      return this.$store.state.timeIndex;
    }
  },
  watch: {
    focus (focus) {
      this.setFocus(focus);
    },

    mode (mode) {
      if (mode === 'selection') {
        // Hide the time index and highlight whatever trace is currently focused.
        this.hideTimeIndex();
        this.setFocus(this.focus);
      } else {
        // Show the time index and turn off trace highlighting.
        this.showTimeIndex();
        this.setFocus(null);
      }
    },

    timeIndex (idx) {
      this.moveTimeIndex(idx);
    }
  },
  methods: {
    hideTimeIndex () {
      select(this.$el)
        .select('line.time-index')
        .style('opacity', 0);
    },
    showTimeIndex () {
      select(this.$el)
        .select('line.time-index')
        .style('opacity', 1);
    },
    moveTimeIndex (idx) {
      const x = this.x(idx);
      select(this.$el)
        .select('line.time-index')
        .attr('x1', x)
        .attr('x2', x);
    },
    setFocus (focus) {
      select(this.$el)
        .selectAll('path')
        .each(function (d, i) {
          if (i === focus) {
            select(this)
              .attr('stroke', 'green')
              .attr('stroke-width', 3);
          } else {
            select(this)
              .attr('stroke', 'black')
              .attr('stroke-width', 1.5);
          }
        });
    }
  },
  mounted () {
    // Collect the first 50 traces and their value range.
    const data = this.dff;
    const range = minmax(data);

    // Create scales for ploting the line charts.
    const x = this.x = scaleLinear()
      .domain([0, data[0].length])
      .range([0, 512]);

    const y = scaleLinear()
      .domain([range[0], range[1]])
      .range([512 / 50, -512 / 50]);

    // Create a d3 line generator.
    const line = d3line()
      .x((d, i) => x(i))
      .y(y);

    const svg = select(this.$el)
      .select('svg');

    // Place rects behind the plots to show the epochs.
    const epochs = this.epochs;
    const epochColormap = scaleOrdinal(schemePastel1);
    svg.append('g')
      .classed('epochs', true)
      .selectAll('rect')
      .data(epochs)
      .enter()
      .append('rect')
      .attr('x', d => x(d.start))
      .attr('y', 0)
      .attr('width', d => x(d.end) - x(d.start))
      .attr('height', 512)
      .attr('fill', d => epochColormap(d.stimulus));

    // Construct a series of g elements for holding each plot.
    const that = this;
    const groups = svg.selectAll('g.dff')
      .data(data)
      .enter()
      .append('g')
      .classed('dff', true)
      .attr('transform', (d, i) => `translate(0, ${i * 512 / 50})`)
      .on('mouseover', function (d, i) {
        if (that.mode === 'selection') {
          that.$store.commit('focus', i);
        }
      });

    // Create mouse target elements for interaction.
    groups.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 512)
      .attr('height', 512 / 50)
      .attr('stroke', 'none')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('pointer-events', 'fill');

    // Plot the data.
    groups.selectAll('path')
      .data(d => [d])
      .enter()
      .append('path')
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none')
      .attr('d', line);

    // Create a time index indicator but leave it invisible for now.
    svg.append('line')
      .classed('time-index', true)
      .attr('x1', x(this.timeIndex))
      .attr('y1', 0)
      .attr('x2', x(this.timeIndex))
      .attr('y2', 512)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .style('opacity', 0);
  }
};

</script>

<template>
  <div class="chart-vue">
      <svg
        :height="height"
        :width="width"
        :viewBox="viewBox"
      >
      <g :transform="transform">
        <path
          fill="none"
          stroke="steelblue"
          :d="line"
        >
        </path>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Chart",
  props: ["chromosome"],
  data() {
    return {
      marginTop: 20,
      marginRight: 0,
      marginBottom: 10,
      marginLeft: 40,
      height: 180,
      width: 180,
      transform : "translate(50.30)"
    };
  },
  computed: {
    path() {
      const x = d3.scaleLinear()
                  .domain([0, 250000000])
                  .range([ 0, this.width - this.marginLeft - this.marginRight])

      const y = d3.scaleLinear()
                  .domain([0, 85000])
                  .range([ this.height - this.marginTop - this.marginBottom, 0 ])

      return d3.line()
        .x(d => x(d.position))
        .y(d => y(d.varIndex));
    },
    line() {
      return this.path(this.chromosome)
    },
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    }
  }
  
};
</script>

<style lang="scss" scoped>

</style>

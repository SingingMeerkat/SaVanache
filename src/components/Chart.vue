<template>
    <div class="chart-vue">
          <svg
            :height="height"
            :width="width"
            :viewBox="viewBox"
          >
            <text x="80" y="180"
              font-family="Arial"
              font-size="9">
              {{ index }}
            </text>

          <g :transform="transform">
            <path
              fill="none"
              stroke="#9579a6"
              stroke-width= "2"
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
  props: ["chromosome", "index", "source"],
  data() {
    return {
      marginTop: 20,
      marginRight: 0,
      marginBottom: 20,
      marginLeft: 30,
      height: 180,
      width: 400,
      transform : "translate(50,30)",
    };
  },
  computed: {
    path() {
      const x = d3.scaleLinear()
                  .domain([0, d3.max(this.chromosome, (d => d.position))])
                  .range([ 0, this.width - this.marginLeft - this.marginRight])

      const y = d3.scaleLinear()
                  .domain([0, d3.max(this.chromosome, (d => d.varIndex))])
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
.chart-vue {
  svg {
    &:hover {
      cursor: pointer;
    }
  }
}
</style>

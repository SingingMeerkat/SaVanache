<template>
    <div>
        <h2> {{ name }} </h2> 
        <svg
            :width="width"
            :height="height"
            :viewBox="viewBox"
          >

          <g :transform="transform">
            <path
              fill="none"
              stroke="#9579a6"
              stroke-width= "2"
              :d="line"
            >
            </path>
            <path
              fill="none"
              stroke="#9579a6"
              stroke-width= "2"
              :d="invertedLine"
            >
            </path>
          </g>
        </svg>
    </div>
</template>

<script>

import * as d3 from "d3";

export default {
  name: "Chromosome",
  props: ["chromosome","name"],
  data() {
    return {
      marginTop: 20,
      marginRight: 0,
      marginBottom: 360,
      marginLeft: 100,
      height: 480,
      width: 1000,
      transform : "translate(25,15)",
    };
  },
  computed: {
    path() {
      const x = d3.scaleLinear()
                  .domain([0, 250000000])
                  .range([0, this.width - this.marginLeft - this.marginRight])

      const y = d3.scaleLinear()
                  .domain([-10000, 85000])
                  .range([ this.height - this.marginTop - this.marginBottom, 0 ])

      return d3.line()
        .x(d => x(d.position))
        .y(d => y(d.varIndex));
    },
    invertedPath() {
      const x = d3.scaleLinear()
                  .domain([0, 250000000])
                  .range([0, this.width - this.marginLeft - this.marginRight])

      const y = d3.scaleLinear()
                  .domain([0, 85000])
                  .range([ this.height - this.marginTop - this.marginBottom, 0 ])

      return d3.line()
        .x(d => x(d.position))
        .y(d => y(d.varIndex*-1));
    },
    line() {
      return this.path(this.chromosome)
    },
    invertedLine() {
      return this.invertedPath(this.chromosome)
    },
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    }
  }
  
};
</script>

<style lang="scss" scoped>

</style>
<template>
    <div>
        <h2> {{ name }} </h2> 
        <svg
            :width="width"
            :height="height"
            :viewBox="viewBox"
          >
          <defs>
              <linearGradient id="lingrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop v-for="(color, i) in colorRange" :key="i" :offset="`${++i*(100/colorRange.length)}%`" :stop-color="color"></stop>
              </linearGradient>
          </defs>
          <g :transform="transform" fill="url(#lingrad)">
            <path
              stroke="#9579a6"
              stroke-width= "2"
              :d="line"
            >
            </path>
            <rect :x="xRect" :y="yRect" :width="widthRect" :height="heightRect" />
            <path
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
      transform: "translate(25,15)",
      xRect: "",
      yRect: "",
      widthRect: "",
      heightRect: "",
      colorRange: ["#351D0F", "#602C17", "#720825", "#840A77", "#8332CF", "#5F63E5", "#5687E2", "#3B97C6", "#32A69D", "#18BD78", "#3CD644", "#A2E04D", "#CDD41C", "#DDD435", "#FCDF91"]
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

     const maxX = d3.max(this.chromosome, d => d.position )

      return d3.line()
        .x((d, i) => {
          console.log(d.position)
            if(i===0) {
              this.xRect = x(d.position)
              this.widthRect = x(maxX-i)
            }
            return x(d.position)
        } )
        .y((d, i) => {
            if(i===0) {
                this.yRect = y(d.position)
            }
            this.heightRect = "12"
            return y(d.varIndex)
        })
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
        .y(d => y((d.varIndex*-1)));
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
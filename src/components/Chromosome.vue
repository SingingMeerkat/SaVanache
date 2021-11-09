<template>
    <div class="container">
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
          
          <g :transform="transform" fill="url(#lingrad)" class="group">
            <line class="eventClass" :x1="x1Line1" :y1="y1Line1" :x2="x2Line1" :y2="y2Line1" style="stroke:rgb(0,0,0);stroke-width:5" />
            <line class="eventClass" :x1="x1Line2" :y1="y1Line2" :x2="x2Line2" :y2="y2Line2" style="stroke:rgb(0,0,0);stroke-width:5" />
            <path
              :d="`${line} ${x1Line2} ${y1Line2} ${x2Line2} ${y2Line2} ${invertedLine} ${x1Line1} ${y1Line1}`"
            >
            </path>
            <path
              stroke="black"
              :d="`${line} ${invertedLine}`"
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
      width: 1200,
      transform: "translate(25,15)",
      x1Line1: "",
      y1Line1: "",
      x2Line1: "",
      y2Line1: "",
      x1Line2: "",
      y1Line2: "",
      x2Line2: "",
      y2Line2: "",
      colorRange: ["#351D0F", "#602C17", "#720825", "#840A77", "#8332CF", "#5F63E5", "#5687E2", "#3B97C6", "#32A69D", "#18BD78", "#3CD644", "#A2E04D", "#CDD41C", "#DDD435", "#FCDF91"]
    };
  },
  methods: {
    getLength(arr) {
      return arr.length
    },
    getMaxWidth(arr) {
      return d3.max(arr, d => d.position )
    },
    getReverseArr(arr) {
      return arr.reverse()
    }
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
        .x((d, i) => {
            if(i === 0) {
              this.x1Line1 = x(d.position) 
            }
            if(i === this.getLength(this.chromosome)-1) {
              this.x1Line2 = x(d.position)
            }
            return x(d.position)
        } )
        .y((d, i) => {
            if(i===0) {
                this.y1Line1 = y(d.varIndex)
            }
            if(i === this.getLength(this.chromosome)-1) {
              this.y1Line2 = y((d.varIndex))
            }
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
        .x((d, i) => {
            if(i===0) {
              this.x2Line1 = x(d.position)
            }
            if(i === this.getLength(this.chromosome)-1) {
              this.x2Line2 = x(d.position)
            }
            return x(d.position)
        } )
        .y((d, i) => {
            if(i===0) {
                this.y2Line1 = y((d.varIndex*-1))
            }
            if(i === this.getLength(this.chromosome)-1) {
              this.y2Line2 = y((d.varIndex*-1))
            }
            return y((d.varIndex*-1))
        })
    },
    line() {
      return this.path(this.chromosome)
    },
    invertedLine() {
      return this.invertedPath(this.getReverseArr(this.chromosome))
    },
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    }
  }
  
};
</script>

<style lang="scss" scoped>

</style>
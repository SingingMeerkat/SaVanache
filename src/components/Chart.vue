<template>
    <div class="chart-vue">
          <svg
             height="10"
             :width="width"
          >
            <g v-for=" (d, index) in getTargetPositive" :key="index"> 
                <defs>
                  <linearGradient id="gradchartpos" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop
                        v-for="(color, i) in d.colorRangeRgb"
                        :key="i"
                        :offset="`${++i * (100 / d.colorRangeRgb.length)}%`"
                        :stop-color="color"
                    ></stop>
                  </linearGradient>
                </defs>
                <rect :x="d.targetStart" y="0" height="10" :width="d.targetWidth+10" fill="url(#gradchartpos)"></rect>
            </g>
          </svg>
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
        <svg
             height="10"
             :width="width"
          >
            <g v-for=" (d, index) in getTargetNegative" :key="index"> 
                <defs>
                  <linearGradient id="gradchartneg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop
                        v-for="(color, i) in d.colorRangeRgb"
                        :key="i"
                        :offset="`${++i * (100 / d.colorRangeRgb.length)}%`"
                        :stop-color="color"
                    ></stop>
                  </linearGradient>
                </defs>
              <rect :x="d.targetStart" y="0" height="10" :width="d.targetWidth+10" fill="url(#gradchartneg)"></rect>
            </g>
          </svg>
      </div>
</template>

<script>
import * as d3 from "d3";


export default {
  name: "Chart",
  props: ["chromosome", "index", "source", "colorRange", "sourceByColor", "target"],
  data() {
    return { 
      displayCircle: false,
      marginTop: 20,
      marginRight: 0,
      marginBottom: 20,
      marginLeft: 30,
      height: 180,
      width: 400,
      transform : "translate(50,30)",
      colorStart: "",
      colorStop:""

    };
  },
  created() {}, 
  methods: {},
  computed: { 
    getScaleX() {
          let x = d3.scaleLinear()
                  .domain([0, d3.max(this.chromosome, (d => d.position))])
                  .range([ 0, this.width - this.marginLeft - this.marginRight])
          return x
    },
    getScaleY() {
          let y = d3.scaleLinear()
                      .domain([0, d3.max(this.chromosome, (d => d.varIndex))])
                      .range([ this.height - this.marginTop - this.marginBottom, 0 ])
          return y
    },
    getTargetPositive() {
          let newTarget = []
          if(typeof this.target != 'undefined' && this.target.length > 0) {
              this.target.map(el => {
                  if((this.getScaleX(el.targetStop) - this.getScaleX(el.targetStart)) > 0) {
                      newTarget.push(Object.assign({}, {svID: el.svID, sourceName: el.sourceName, sourceStart: el.sourceStart, sourceStop: el.sourceStop, strand: el.strand, targetName: el.targetName, targetStart: this.getScaleX(el.targetStart), targetStop: this.getScaleX(el.targetStop), targetWidth: (this.getScaleX(el.targetStop) - this.getScaleX(el.targetStart)), colorStart: el.colorStart, colorStop: el.colorStop, colorRangeRgb: el.colorRangeRgb} ))
                  }
                      
              })
          }
          return newTarget
    },
    getTargetNegative() {
          let newTarget = []
          if(typeof this.target != 'undefined' && this.target.length > 0) {
              this.target.map(el => {
                if((this.getScaleX(el.targetStop) - this.getScaleX(el.targetStart)) < 0) {
                    newTarget.push(Object.assign({}, {svID: el.svID, sourceName: el.sourceName, sourceStart: el.sourceStart, sourceStop: el.sourceStop, strand: el.strand, targetName: el.targetName, targetStart: this.getScaleX(el.targetStart), targetStop: this.getScaleX(el.targetStop), targetWidth: (this.getScaleX(el.targetStop) - this.getScaleX(el.targetStart))*-1, colorStart: el.colorStart, colorStop: el.colorStop, colorRangeRgb: el.colorRangeRgb} ))
                }
              })
          }
          return newTarget
    },
    path() {
      return d3.line()
        .x(d => this.getScaleX(d.position))
        .y(d => this.getScaleY(d.varIndex));
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
  height: 250px;
  svg {
    &:hover {
      cursor: pointer;
    }
  }
}
</style>

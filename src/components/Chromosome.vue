<template>
  <div class="container">
    <h2>{{ name }}</h2>
    <svg :width="width" :height="height" :viewBox="viewBox">
      <defs>
        <linearGradient id="lingrad" x1="0" y1="0" x2="1" y2="0">
          <stop v-for="stop in stops" :key="stop.key" :offset="stop.offset" :stop-color="stop.color"></stop>
        </linearGradient>
      </defs>

      <g :transform="transform">
      
        <path
          fill="url(#lingrad)"
          :d="`${line} ${x2Line2} ${y2Line2} ${x1Line2} ${y1Line2} ${invertedLine} ${x2Line1} ${y2Line1} ${x1Line1} ${y1Line1}`"
        ></path>
        <path stroke="black" fill="none" :d="`${line} ${invertedLine}`"></path>
      </g>
       <rect
        x=0
        y=0
        :width="width"
        :height="height"
        fill='transparent'
        cursor="crosshair"
        class='track-overlay'
        ref='ref_track-overlay'
      />
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import { getLength, getMaxX, getMaxY, getReverseArr, normalize, closestPosition, matchingValue, getColor} from "../helpers/helpers"

export default {
  name: "Chromosome",
  props: ["chromosome", "name", "sources", "colorRange", "source", "getColorScale"],
  data() {
    return {
      marginTop: 20,
      marginRight: 0,
      marginBottom: 360,
      marginLeft: 100,
      height: 480,
      width: 1200,
      transform: "translate(30,15)",
      domainY: null,
      x1: 10,
      x2: 1190,
    };
  },
  created() {},
  mounted() {
    d3.select(this.$refs['ref_track-overlay'])
      .call(
        d3.drag()
          .on("start drag", (event) => this.updateThreshold(event.x) ) // eslint-disable-line
      );
  },
  methods: {
    getLength,
    getMaxX,
    getMaxY,
    getReverseArr,
    normalize,
    closestPosition,
    matchingValue,
    getColor,
    updateThreshold(mousePos) {
      if (Math.abs(mousePos - this.x1) > Math.abs(mousePos - this.x2)) {
        this.x2 = mousePos;
      } else { this.x1 = mousePos}
    },
  
  },
  computed: {
    x1AsPption() { return this.x1 / this.width },
    preX1() { return Math.max(this.x1AsPption - 0.01, 0)},
    x2AsPption() { return this.x2 / this.width },
    postX2() { return Math.min(this.x2AsPption + 0.01, this.width)},
    
    stops() { 
      let stopArr = [
        {
          key:'farLeft',
          offset:0,
          color:'grey',
        },
        {
          key:'Left',
          offset: this.preX1,
          color:'grey',
        },
        {
          key:'firstBoundaryLeft',
          offset: this.preX1,
          color:'black',
        },
        {
          key:'firstBoundaryRight',
          offset: this.x1AsPption,
          color:'black',
        }

      
      ]
      this.getColorScale.map((color, i) => {
       let offset;
        if(i === 0) {
          offset = this.x1AsPption
        } else if(i === this.getColorScale.length) {
          offset = this.x2AsPption
        } else {
          offset = (++i * ((this.x2AsPption-this.x1AsPption)/this.getColorScale.length)+this.x1AsPption)
        }
        stopArr.push(Object.assign({}, {
                          key: `rangeColor${i}`, 
                          offset:offset,
                          color:color}))
      })
      
      stopArr.push({
          key:'secondBoundaryLeft',
          offset: this.x2AsPption,
          color:'black',
        },
        {
          key:'secondBoundaryRight',
          offset: this.postX2,
          color:'black',
        },
        {
          key:'Right',
          offset: this.postX2,
          color:'grey',
        },
        {
          key:'farRight',
          offset:100,
          color:'grey',
        })

      return stopArr
        
    },
    getScaleX() {
          let x = d3.scaleLinear()
                  .domain([0, d3.max(this.chromosome, (d => d.position))])
                  .range([ 0, this.width - this.marginLeft - this.marginRight])
          return x
    },
    getScaleY() {
          let y = d3.scaleLinear()
                      .domain([this.domainY, d3.max(this.chromosome, (d => d.varIndex))])
                      .range([ this.height - this.marginTop - this.marginBottom, 0 ])
          return y
    },
    getInvertedScaleY() {
          let y = d3.scaleLinear()
                      .domain([0, d3.max(this.chromosome, (d => d.varIndex))])
                      .range([ this.height - this.marginTop - this.marginBottom, 0 ])
          return y
    },
    path() {
        const maxY = this.getMaxY(this.chromosome)
        return d3
            .line()
            .x((d, i) => {
                
                if (i === this.getLength(this.chromosome) - 1) {
                    this.x1Line2 = this.getScaleX(d.position);
                    this.x2Line2 = this.getScaleX(d.position)
    
                }
                return this.getScaleX(d.position);
            })
            .y((d, i) => {
               
                if (i === this.getLength(this.chromosome) - 1) {
                    this.y1Line2 = this.getScaleY((d.varIndex-this.domainY)*-1);
                    this.y2Line2 = this.getScaleY((d.varIndex-this.domainY)*-1)
                }
                if (d.varIndex < 20 && maxY < 20) {
                    this.domainY = -3;
                } else if (
                    d.varIndex > 20 &&
                    d.varIndex < 500 &&
                    maxY > 20 &&
                    maxY < 500
                ) {
                    this.domainY = 0;
                } else {
                    this.domainY = -10000;
                }
                return this.getScaleY(d.varIndex);
            });
    },
    invertedPath() {
      return d3
        .line()
         .x((d,i) => {
                if (i === 0) {
                    this.x1Line1 = this.getScaleX(d.position);
                    this.x2Line1 = this.getScaleX(d.position);
                }
              return this.getScaleX(d.position);
            })
        .y((d,i) => {
           if (i === 0) {
                    this.y1Line1 = this.getScaleY(d.varIndex);
                    this.y2Line1 = this.getScaleY(d.varIndex);
                }
              return this.getInvertedScaleY(d.varIndex * -1);
           });
    },
    line() {
        return this.path(this.chromosome);
    },
    invertedLine() {
        return this.invertedPath(this.chromosome);
    },
    viewBox() {
        return `0 0 ${this.width} ${this.height}`;
    },
  },
};

</script>

<style lang="scss" scoped>
line {
  cursor: move;
}
</style>
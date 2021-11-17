<template>
  <div class="container">
    <h2>{{ name }}</h2>
    <svg :width="width" :height="height" :viewBox="viewBox">
      <defs>
        <linearGradient id="lingrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            v-for="(color, i) in colorRange"
            :key="i"
            :offset="`${++i * (100 / colorRange.length)}%`"
            :stop-color="color"
          ></stop>
        </linearGradient>
      </defs>

      <g :transform="transform" class="group" @click="dragLines">
        <line
          class="eventLine"
          :x1="x1Line1"
          :y1="y1Line1"
          :x2="x2Line1"
          :y2="y2Line1"
          style="stroke: rgb(0, 0, 0); stroke-width: 20"
        />
        <line
        class="eventLine2"
          :x1="x1Line2"
          :y1="y1Line2"
          :x2="x2Line2"
          :y2="y2Line2"
          style="stroke: rgb(0, 0, 0); stroke-width: 20"
        />
        <path
          fill="url(#lingrad)"
          :d="`${line} ${x1Line2} ${y1Line2} ${x2Line2} ${y2Line2} ${invertedLine} ${x1Line1} ${y1Line1}`"
        ></path>
        <path stroke="black" fill="none" :d="`${line} ${invertedLine}`"></path>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Chromosome",
  props: ["chromosome", "name", "sources", "colorRange", "source"],
  data() {
    return {
      marginTop: 20,
      marginRight: 0,
      marginBottom: 360,
      marginLeft: 100,
      height: 480,
      width: 1200,
      transform: "translate(30,15)",
      calculateColorRegion: null,
      maxDomainX: null,
      x1Line1: null,
      y1Line1: null,
      x2Line1: null,
      y2Line1: null,
      x1Line2: null,
      y1Line2: null,
      x2Line2: null,
      y2Line2: null,
      domainY: null,
      deltaX1: null,
      deltaY1: null,
      deltaX2: null,
      deltaY2: null,
      
    };
  },
  created() {},
  methods: {
    getLength(arr) {
      return arr.length;
    },
    getMaxX(arr) {
      return d3.max(arr, (d) => d.position);
    },
    getMaxY(arr) {
      return d3.max(arr, (d) => d.varIndex);
    },
    normalize(min, max) {
        const delta = max - min;
        return val => ( (val < min? min: (val > max? max : val)) - min ) / delta;
    },
    closestPosition(array, goal) {
        return array.reduce((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    },
    matchingValue(array1, val){
        return array1.find(element => {
          if(val === element.norm) {
            return element.color
          }
        })
    },
    getColor(arr) {
        const maxX = this.getMaxX(this.chromosome)
        let sourceStart = []
        let sourceStop = []
        let sourceStartStop = []
        let normValueStart = []
        let normValueStop = []
        let arrColorbyId = []
        let getClosestStart = []
        let getClosestStop = []
        let resultColorStart = []
        let resultColorStop = []
        arr.map(element => {
            if(element.sourceName === this.name) {
                sourceStart.push(element.sourceStart)
                sourceStop.push(element.sourceStop)
            }
            sourceStartStop = sourceStart.map((item, i) => Object.assign({}, { sourceName: element.sourceName,sourceStart : item, sourceStop : sourceStop[i]} ));
        })

        sourceStart.map(element => normValueStart.push(element/maxX))
        sourceStop.map(element => normValueStop.push(element/maxX))
        let mergeSourceStartAndStop = normValueStart.map((item, i) => Object.assign({}, { sourceStart : item, sourceStop : normValueStop[i]} ));

        this.colorRange.map((_, i) => arrColorbyId.push(i+1))
        let arrColorNormalized = arrColorbyId.map(this.normalize(1, this.colorRange.length))
        let mergeColorNorm = this.colorRange.map((item, i) => Object.assign({}, {color: item, norm: arrColorNormalized[i]} ));

        mergeSourceStartAndStop.map(element => {
          getClosestStart.push(this.closestPosition(arrColorNormalized, element.sourceStart))
          getClosestStop.push(this.closestPosition(arrColorNormalized, element.sourceStop))
        })
        getClosestStart.map(item => {
          resultColorStart.push(this.matchingValue(mergeColorNorm,item))
        })
        getClosestStop.map(item => {
          resultColorStop.push(this.matchingValue(mergeColorNorm,item))
        })
        let colorArrStartStop = resultColorStart.map((item, i) => Object.assign({}, {colorStart: item.color, colorStop: resultColorStop[i].color} ));
        let getColorBySourceName = sourceStartStop.map((item, i) => Object.assign({}, {sourceName: item.sourceName, sourceStart: item.sourceStart, sourceStop: item.sourceStop, colorStart: colorArrStartStop[i].colorStart, colorStop: colorArrStartStop[i].colorStop} ));

        return getColorBySourceName
        
    },
    getReverseArr(arr) {
      return arr.reverse();
    },
    dragstarted() {
      d3.select(".eventLine").raise().attr("active", true);
    },
    dragged(event) {
        this.deltaX1 = event.x;
        this.deltaY1 = event.y;
        this.deltaX2 = event.x;
        this.deltaY2 = event.y+this.y2Line1;

        let current = d3.select(".eventLine");

        current.attr("x1", this.deltaX1)
                .attr("y1", this.deltaY1)
                .attr("x2", this.deltaX2)
                .attr("y2", this.deltaY2);
  
    },
    dragended() {
      d3.select(".eventLine").attr("active", false);
    },
    dragLines() {
      var drag = d3
        .drag()
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended);
      d3.select(".eventLine").call(drag);
    },
  },
  computed: {
    path() {
        const maxX = this.getMaxX(this.chromosome)
        const maxY = this.getMaxY(this.chromosome)
        const x = d3
            .scaleLinear()
            .domain([0, maxX])
            .range([0, this.width - this.marginLeft - this.marginRight]);
        const y = d3
            .scaleLinear()
            .domain([this.domainY, maxY])
            .range([this.height - this.marginTop - this.marginBottom, 0]);

        return d3
            .line()
            .x((d, i) => {
                if (i === 0) {
                    this.x1Line1 = x(d.position);
                }
                if (i === this.getLength(this.chromosome) - 1) {
                    this.x1Line2 = x(d.position);
                }
                return x(d.position);
            })
            .y((d, i) => {
            if (i === 0) {
                this.y1Line1 = y(d.varIndex);
            }
            if (i === this.getLength(this.chromosome) - 1) {
                this.y1Line2 = y(d.varIndex);
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
            return y(d.varIndex);
            });
    },
    invertedPath() {
      const maxX = this.getMaxX(this.chromosome)
      const maxY = this.getMaxY(this.chromosome)
      const x = d3
        .scaleLinear()
        .domain([0, maxX])
        .range([0, this.width - this.marginLeft - this.marginRight]);
      const y = d3
        .scaleLinear()
        .domain([0, maxY])
        .range([this.height - this.marginTop - this.marginBottom, 0]);

      return d3
        .line()
         .x((d, i) => {
                if (i === 0) {
                    this.x2Line1 = x(d.position);
                }
                if (i === this.getLength(this.chromosome) - 1) {
                    this.x2Line2 = x(d.position);
                }
                return x(d.position);
            })
        .y((d, i) => {
          if (i === 0) {
            this.y2Line1 = y(d.varIndex * -1);
          }
          if (i === this.getLength(this.chromosome) - 1) {
            this.y2Line2 = y(d.varIndex * -1);
          }
          return y(d.varIndex * -1);
        });
    },
    line() {
        return this.path(this.chromosome);
    },
    invertedLine() {
        return this.invertedPath(this.getReverseArr(this.chromosome));
    },
    viewBox() {
        this.getColor(this.source)
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
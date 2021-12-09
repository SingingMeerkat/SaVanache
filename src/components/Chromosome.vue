<template>
  <div class="container">
    <h2>{{ name }}</h2>
    <svg :width="width" :height="height" :viewBox="viewBox">
      <defs>
        <linearGradient id="lingrad" x1="0" y1="0" x2="1" y2="0">
          <stop v-for="stop in stops" :key="stop.key" :offset="stop.offset" :stop-color="stop.color"></stop>
        </linearGradient>
      </defs>

      <g>
        <path
          fill="url(#lingrad)"
          :d="`${line}  L${invertedLine} Z`"
        ></path>
        <path stroke="black" fill="none" :d="`${line} M${invertedLine}`"></path>
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
import {mapActions, mapState} from "vuex";
import { getLength, getMaxY } from "../helpers/helpers"
import {SVGPathUtils} from 'svg-path-utils';
const utils = new SVGPathUtils();

export default {
  name: "Chromosome",
  props: ["chromosome", "name", "sources", "colorRange", "source", "height", "width", "x1AsPption", "preX1", "x2AsPption", "postX2"],
  data() {
    return {
      marginTop: 20,
      marginRight: 0,
      marginBottom: 360,
      marginLeft: 0,
      domainY: null,
    };
  },
  created() {},
  mounted() {
    d3.select(this.$refs['ref_track-overlay'])
        .call(
            d3.drag()
              .on("drag", (event) => {this.updateThreshold(event.x)})
        );
  },
  methods: {
     ...mapActions({
      updateX1: 'updateX1',
      updateX2: 'updateX2'
    }),
    getLength,
    getMaxY,
    updateThreshold(mousePos) {
      if (Math.abs(mousePos - this.x1) > Math.abs(mousePos - this.x2)) {
          mousePos < this.width ? this.x2 = mousePos : mousePos = this.width 
      } else {
          mousePos > 0 ? this.x1 = mousePos : mousePos = 0
      }
    },
  },
  computed: {
     ...mapState({
      x1: 'x1',
      x2: 'x2',
    }),

    x1: {
        get () { return this.$store.state.x1},
        set (value) { this.updateX1(value) }
    },
    x2: {
        get () { return this.$store.state.x2},
        set (value) { this.updateX2(value) }
    },
    stops() {
      let stopArr = [
        {
          key: "farLeft",
          offset: 0,
          color: "grey",
        },
        {
          key: "Left",
          offset: this.preX1,
          color: "grey",
        },
        {
          key: "firstBoundaryLeft",
          offset: this.preX1,
          color: "black",
        },
        {
          key: "firstBoundaryRight",
          offset: this.x1AsPption,
          color: "black",
        },
      ];
      this.colorRange.map((color, i) => {
        let offset;
        if (i === 0) {
          offset = this.x1AsPption;
        } else if (i === this.colorRange.length) {
          offset = this.x2AsPption;
        } else {
          offset =
            ++i *
              ((this.x2AsPption - this.x1AsPption) / this.colorRange.length) +
            this.x1AsPption;
        }
        stopArr.push(
          Object.assign(
            {},
            {
              key: `rangeColor${i}`,
              offset: offset,
              color: color,
            }
          )
        );
      });

      stopArr.push(
        {
          key: "secondBoundaryLeft",
          offset: this.x2AsPption,
          color: "black",
        },
        {
          key: "secondBoundaryRight",
          offset: this.postX2,
          color: "black",
        },
        {
          key: "Right",
          offset: this.postX2,
          color: "grey",
        },
        {
          key: "farRight",
          offset: 100,
          color: "grey",
        }
      );

      return stopArr;
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
            .x(d => {
                
                return this.getScaleX(d.position);
            })
            .y(d => {
               
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
         .x(d => {
              return this.getScaleX(d.position);
            })
        .y(d => {
              return this.getInvertedScaleY(d.varIndex * -1);
           });
    },
    line() {
        return this.path(this.chromosome);
    },
    invertedLine() {
      const inverse_d = utils.inversePath(this.invertedPath(this.chromosome));
      let temp=[...inverse_d]
      temp.shift()
      return temp.join('');
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
<template>
  <div class="container-chro">
    <h2>{{ name }}</h2>
    <div class="flex-wrap">
        <div class="tooltip-left"></div>
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
          <div class="tooltip-right"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import {mapActions, mapState} from "vuex";
import { getLength, getMaxX, getMaxY, numberWithCommas } from "../helpers/helpers"
import {SVGPathUtils} from 'svg-path-utils';
const utils = new SVGPathUtils();

export default {
  name: "Chromosome",
  props: ["chromosome", "name", "sources", "colorRange", "source", "height", "width", "x1AsPption", "preX1", "x2AsPption", "postX2", "colorBlack", "colorGrey"],
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
              .on("start drag", (event) => this.updateThreshold(event.x))
        );
  },
  methods: {
     ...mapActions({
      updateX1: 'updateX1',
      updateX2: 'updateX2'
    }),
    getLength,
    getMaxY,
    getMaxX,
    numberWithCommas,
    updateThreshold(mousePos) {
      const max = getMaxX(this.chromosome)
      if (Math.abs(mousePos - this.x1) > Math.abs(mousePos - this.x2)) {
          mousePos < this.width ? this.x2 = mousePos : this.x2 = this.width 
          d3.select(".tooltip-right")
            .html("Position right: " + this.numberWithCommas(Math.round((this.x2*max)/this.width)))
      } else {
          mousePos > 0 ? this.x1 = mousePos : this.x1 = 0
          d3.select(".tooltip-left")
            .html("Position left: " + this.numberWithCommas(Math.round((this.x1*max)/this.width)))
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
          color: this.colorGrey,
        },
        {
          key: "Left",
          offset: this.preX1,
          color: this.colorGrey,
        },
        {
          key: "firstBoundaryLeft",
          offset: this.preX1,
          color: this.colorBlack,
        },
        {
          key: "firstBoundaryRight",
          offset: this.x1AsPption,
          color: this.colorBlack,
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
          color: this.colorBlack,
        },
        {
          key: "secondBoundaryRight",
          offset: this.postX2,
          color: this.colorBlack,
        },
        {
          key: "Right",
          offset: this.postX2,
          color: this.colorGrey,
        },
        {
          key: "farRight",
          offset: 100,
          color: this.colorGrey,
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
.container-chro {
  margin: 0 auto;
  text-align:center;
  .flex-wrap {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .tooltip-right{
    margin-left : 3rem;
  }

  .tooltip-left{
    margin-right : 3rem;
  }

}


</style>
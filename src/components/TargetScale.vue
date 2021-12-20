<template>
    <div class="scale">
        <h1>Menu</h1>
        <div id="#slider-wrapper">

            <svg :width="widthScale+20" height="20">
              <rect
                  x=0
                  y=0
                  :width="widthScale"
                  :height="heightScale"
                  fill='transparent'
                  cursor="crosshair"
                  class='track-overlay'
                  ref='ref_track-overlay'
              />
              <rect
                :x="x1Target"
                y=0
                width="5"
                height="20"
                fill='black'
                cursor="crosshair"
              />
              <rect
                :x="x2Target"
                y=0
                width="5"
                height="20"
                fill='black'
                cursor="crosshair"
              />
             
          </svg>
          <svg class="slider" :width="widthScale+20" :height="heightScale">
              <g id="wrapper">
              </g>
          </svg>
        </div>
        <div class="left-side">
          <p>Position x1 : {{ numberWithCommas(Math.round(valueX1Unit)) }}</p>
          <p>Position x2 : {{ numberWithCommas(Math.round(valueX2Unit)) }}</p>
        </div>
    </div>
</template>

<script>
import * as d3 from "d3"; 
import { mapActions } from "vuex";
import { numberWithCommas } from "../helpers/helpers"


export default {
  name: "TargetScale",
  data() {
      return {
        widthScale: 500,
        heightScale: 30,
        x1Target:0,
        x2Target:500,
        valueX1Unit:50,
        valueX2Unit:10000000
      }
    },
  mounted() {
    //build the slider scale on the axis
    this.axis(d3.scaleLog().domain([50, 1e7]))
                .ticks(10, "~s")
                .render()

    //slider drag
    d3.select(this.$refs['ref_track-overlay'])
        .call(
            d3.drag()
              .on("start drag", (event) => this.updateThreshold(event.x))
        );
  },
  watch: {
    x1Target(){
      this.updateX1Target(this.x1Target)
    },
    x2Target(){
      this.updateX2Target(this.x2Target)
    },
    valueX1Unit(){
      this.updateValueX1Unit(this.valueX1Unit)
    },
    valueX2Unit(){
      this.updateValueX2Unit(this.valueX2Unit)
    }
  },
  methods: {
    numberWithCommas,
     ...mapActions({
      updateX1Target: 'updateX1Target',
      updateX2Target: 'updateX2Target',
      updateValueX1Unit: 'updateValueX1Unit',
      updateValueX2Unit: 'updateValueX2Unit'
    }),
    updateThreshold(mousePos) {
      if (Math.abs(mousePos - this.x1Target) > Math.abs(mousePos - this.x2Target)) {
          mousePos < this.widthScale ? this.x2Target = mousePos : this.x2Target = this.widthScale
          this.valueX2Unit = this.xScale.invert(this.x2Target)     
      } else {
          mousePos > 0 ? this.x1Target = mousePos : this.x1Target = 0  
          this.valueX1Unit = this.xScale.invert(this.x1Target) 
      }
    },
    axis(scale) {
        return Object.assign(d3.axisBottom(scale.range([0, this.widthScale])), {
            render() {
            return d3.select('#wrapper')
                .call(this)
                .node();
            }
        });
    },
    
  },
  computed: {
    xScale() {
          return d3.scaleLog().domain([50, 1e7])
                    .range([0, this.widthScale])
    },
  }
};
</script>

<style lang="scss" scoped>
.scale {
    margin-top: 5rem;
    margin-left: 2rem;
    width: 520px;

      
    .left-side {
      text-align: start;
    }
    
    
    
}

</style>

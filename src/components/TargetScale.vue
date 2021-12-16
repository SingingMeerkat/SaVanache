<template>
    <div class="scale">
        <h1>Menu</h1>
        <div id="#slider-wrapper">
            <svg :width="widthScale" height="20">
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
                height="40"
                fill='black'
                cursor="crosshair"
              />
              <rect
                :x="x2Target"
                y=0
                width="5"
                height="40"
                fill='black'
                cursor="crosshair"
              />
             
          </svg>
          <svg :width="widthScale" :height="heightScale">
              <g id="wrapper">
              </g>
          </svg>
        </div>
    </div>
</template>

<script>
import * as d3 from "d3"; 
import { mapActions } from "vuex";

export default {
  name: "TargetScale",
  data() {
      return {
        widthScale: 500,
        heightScale: 30,
        x1Target:5,
        x2Target:485,
        valueX1Unit:50,
        valueX2Unit:10000000
      }
    },
  mounted() {
    this.axis(d3.scaleLog().domain([50, 1e7]))
                .ticks(10, "~s")
                .render()

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
     ...mapActions({
      updateX1Target: 'updateX1Target',
      updateX2Target: 'updateX2Target',
      updateValueX1Unit: 'updateValueX1Unit',
      updateValueX2Unit: 'updateValueX2Unit'
    }),
    updateThreshold(mousePos) {
      if (Math.abs(mousePos - this.x1Target) > Math.abs(mousePos - this.x2Target)) {
          mousePos < this.widthScale ? this.x2Target = mousePos : mousePos = this.widthScale 
          this.valueX2Unit = this.xScale.invert(this.x2Target)     
      } else {
          mousePos > 0 ? this.x1Target = mousePos : mousePos = 0  
          this.valueX1Unit = this.xScale.invert(this.x1Target) 
      }
    },
    axis(scale) {
        return Object.assign(d3.axisBottom(scale.range([5, this.widthScale-10])), {
            render() {
            return d3.select('#wrapper')
                .call(this)
                .node();
            }
        });
    }
  },
  computed: {
    xScale() {
          return d3.scaleLog().domain([50, 1e7])
                    .range([0, this.widthScale-10])
    },
  }
};
</script>

<style lang="scss" scoped>
.scale {
    margin-top: 5rem;
    margin-left: 5.5rem;
    width: 500px;
    
}

</style>

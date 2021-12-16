<template>
    <div class="scale">
        <h1>Menu</h1>
        <div id="#slider-wrapper">
          <Slider v-model="value" :min="1" :max="10000000" />
          <svg :width="widthScale" height="30">
              <g id="wrapper">
              </g>
          </svg>
        </div>
        
    </div>
</template>

<script>
import * as d3 from "d3"; 
import Vue from "vue";
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
import Slider from '@vueform/slider/dist/slider.vue2.js'
import { mapActions } from "vuex";

export default {
  name: "TargetScale",
  components: {
      Slider,
  },
  props: [
    "getListTableOfTargetChrom",
  ],
   data() {
      return {
        widthScale: 500,
        value: [1, 10000000]
      }
    },
  mounted() {
    this.axis(d3.scaleLog().domain([1e0, 1e7]))
                .ticks(10, "~s")
                .render()
  
  },
  watch: {
    value() {
      this.updateLocalAreaSelected(this.value);
    },
  },
  methods: {
    ...mapActions([
      'updateLocalAreaSelected',
    ]),
    axis(scale) {
        return Object.assign(d3.axisBottom(scale.range([0, this.widthScale-10])), {
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
          return d3.scaleLog().domain([1e0, 1e7])
                    .range([0, this.widthScale-10])
    },
    
  }
  
};
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style lang="scss" scoped>
.scale {
    margin-top: 5rem;
    margin-left: 5.5rem;
    width: 490px;
    .slider-connect {
      background-color: rgb(0, 188, 255);
    }


}

</style>

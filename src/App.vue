<template>
  <div class="container">
    <h1>SaVanache</h1>
    <div  class="chromosomes-grid">
      <div v-for="(chromosome, index) in chromosomes" :key="index" @click="displayCurrentChrom(index, chromosome)" >
            <Chart :chromosome="chromosome" :index="index" :colorRange="colorRange" :source="source" :target="getTargetByChrom(index)" :chartWidth="chartWidth"/>
      </div>
    </div>
    <hr>
    <div>
        <Chromosome v-if="display" :name="name" :chromosome="chromosome" :colorRange="colorRange" :source="source" :height="height" :width="width" :x1AsPption="x1AsPption" :preX1="preX1" :x2AsPption="x2AsPption" :postX2="postX2" />
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import Chart from "./components/Chart.vue";
import { mapState,mapGetters} from "vuex";
import Chromosome from './components/Chromosome.vue';
import { closestPosition, getReverseArr } from './helpers/helpers'

export default {
  name: "App",
  components: {
    Chart: Chart,
    Chromosome: Chromosome,
  },
  data() {
    return {
      display: false,   
      name:"",
      colorRange: [
        "#351D0F",
        "#602C17",
        "#720825",
        "#840A77",
        "#8332CF",
        "#5F63E5",
        "#5687E2",
        "#3B97C6",
        "#32A69D",
        "#18BD78",
        "#3CD644",
        "#A2E04D",
        "#CDD41C",
        "#DDD435",
        "#FCDF91",
      ],
      source:[],
      newSources: [],
      chromosome: {}
    }
  },
  mounted() {
        let givesId = []
        this.sources.map((el) => {
          return this.sources.push(Object.assign({}, {svID: el.svID, sourceName: el.targetName, sourceStart: el.targetStart, sourceStop: el.targetStop, strand: el.strand, targetName: el.sourceName, targetStart: el.sourceStart , targetStop: el.sourceStop }))
        }) 
        this.sources.map((_, i) => givesId.push(i+1))
        const newSources = this.sources.map((el, i) => Object.assign({}, {id: givesId[i], svID: givesId[i]+"_"+el.sourceName+"_"+el.targetName, sourceName: el.sourceName, sourceStart: el.sourceStart, sourceStop: el.sourceStop, strand: el.strand, targetName: el.targetName, targetStart: el.targetStart, targetStop: el.targetStop} ));
        this.newSources =  newSources
  },
  methods: {
    closestPosition,
    getReverseArr,
    getRangeTargetChart() {
      let domainArr = []
      const max = d3.max(this.chromosome, (d => d.position))
      let x1InChroUnit=(this.x1*max)/this.width
      let x2InChroUnit=(this.x2*max)/this.width
      this.colorRange.map((_, i) => {
        let offset;
        if (i === 0) {
          offset = x1InChroUnit;
        } else if (i === this.colorRange.length) {
          offset = x2InChroUnit;
        } else {
          offset =
            ++i *
              ((x2InChroUnit - x1InChroUnit) / this.colorRange.length) +
            x1InChroUnit;
        }
         domainArr.push(offset)
      });
      return domainArr
    },
    getDomainArr() {
      const max = d3.max(this.chromosome, (d => d.position))
      let domainArr = [0]

      let x1InChroUnit=(this.x1*max)/this.width
      let leftClampSizeInChroUnit = (this.x1AsPption-this.preX1)*max
      let left = x1InChroUnit - leftClampSizeInChroUnit
 
      
      domainArr.push(left, left, x1InChroUnit)
      let rightClampSizeInChroUnit = (this.postX2-this.x2AsPption)*max
      let x2InChroUnit=(this.x2*max)/this.width
      let right = x2InChroUnit + rightClampSizeInChroUnit

      this.colorRange.map((_, i) => {
        let offset;
        if (i === 0) {
          offset = x1InChroUnit;
        } else if (i === this.colorRange.length) {
          offset = x2InChroUnit;
        } else {
          offset =
            ++i *
              ((x2InChroUnit - x1InChroUnit) / this.colorRange.length) +
            x1InChroUnit;
        }
         domainArr.push(offset)
      });
      domainArr.push(x2InChroUnit, right, right, max)

      return domainArr 
    },
    getColorRangeDrag() {
      let colorArray = ['#808080', '#808080','#000000', '#000000']
      this.colorRange.map(e=>colorArray.push(e))
      colorArray.push('#000000', "#000000","#808080", "#808080")
      return colorArray
    },
    checkBetween(el) {
      const max = d3.max(this.chromosome, (d => d.position))
      if(el.targetStart > (this.x1*max)/this.chartWidth && el.targetStart < (this.x2*max)/this.chartWidth && el.targetStop > (this.x1*max)/this.chartWidth && el.targetStop < (this.x2*max)/this.chartWidth) {
        return true
      }
    },
    getElementsBySources () {
        let elementsBySources = [] 
        
        this.newSources.map(item => {
          return this.name === item.sourceName ? elementsBySources.push( Object.assign({}, {id: item.id, svID: item.svID, sourceName: item.sourceName, sourceStart: item.sourceStart, sourceStop: item.sourceStop, strand: item.strand, targetName: item.targetName, targetStart: item.targetStart, targetStop: item.targetStop, colorStart: this.getColorScale(item.sourceStart), colorStop: this.getColorScale(item.sourceStop)})) : elementsBySources.push( Object.assign({}, {}))
        })
        if (elementsBySources.length === 0) return null;
        return elementsBySources  
    },
    getColorStartIndex(start) {
      let indexColorStartInScale;

       indexColorStartInScale = this.getRangeTargetChart().indexOf(this.closestPosition(this.getRangeTargetChart(), start))
      this.colorRange.map((_, i ) => {
          if(i===indexColorStartInScale) {
            return indexColorStartInScale
          }
      })
      return indexColorStartInScale
    },
    getColorStopIndex(stop) {
      let indexColorStopInScale;
      indexColorStopInScale = this.getRangeTargetChart().indexOf(this.closestPosition(this.getRangeTargetChart(), stop))
       this.colorRange.map((_, i ) => {
          if(i===indexColorStopInScale) {
            return indexColorStopInScale
          }

      })
      return indexColorStopInScale
    },
    getTargetByChrom (index) {
        let result = []
        this.source.map((el) => {
            if(el.targetName === index && this.checkBetween(el)) {
                
                result.push(Object.assign({}, {id: el.id, svID: el.svID, sourceName: el.sourceName, sourceStart: el.sourceStart, sourceStop: el.sourceStop, strand: el.strand, targetName: el.targetName, targetStart: el.targetStart, targetStop: el.targetStop, colorStart: el.colorStart, colorStop: el.colorStop, colorRangeRgb: el.strand === "+" ? this.colorRange.slice(this.getColorStartIndex(el.sourceStart), this.getColorStopIndex(el.sourceStop)+1)  : this.getReverseArr(this.colorRange.slice(this.getColorStartIndex(el.sourceStart), this.getColorStopIndex(el.sourceStop)+1))} ))
            } 
        })
        return result
    },
    displayCurrentChrom(id, chrom) {
        this.name = id
        this.chromosome = chrom
        this.display = true
        this.source = this.getElementsBySources()
    }
  },
  computed: {
     ...mapState({
      x1: 'x1',
      x2: 'x2',
    }),
    ...mapGetters({
      x1AsPption: 'getX1AsPption',
      preX1: 'getPreX1',
      x2AsPption: 'getX2AsPption',
      postX2: 'getPostX2'
    }),

    getColorScale() {
      let colorRange = this.getColorRangeDrag()
      let domainArr = this.getDomainArr()
      let colorScale = d3.scaleLinear()
                .domain(domainArr)
                .range(colorRange)
      return colorScale  
    },
   
    chromosomes () {
      return this.$store.state.chromosomes
    },
    sources () {
      return this.$store.state.sources
    },
    width () {
      return this.$store.state.width
    },
    chartWidth () {
      return this.$store.state.chartWidth
    },
    height () {
      return this.$store.state.height
    },
   

  }
 
};
</script>

<style lang="scss">

body {
  font-size: "Arial";

    .container {
      margin: 0 auto;
      width: 90%;
      text-align: center;
      h1 {
        margin-bottom: 0;
      }

      hr {
        margin: 40px 0;
      }

      .chromosomes-grid {
        margin: 0 auto;
        padding-bottom: 2rem;
        width: 95%;
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: 1fr 1fr;
        overflow-x: scroll;

        &::-webkit-scrollbar {
          width:100%;
        }

        &::-webkit-scrollbar-track {
          background-color: #e4e4e4;
          border-radius: 100px;
          border-top: 5px solid #fff;
          border-bottom: 5px solid #fff;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #9579a6;
          border-radius: 100px;
        }
      }

    }
}


</style>
<template>
  <div class="container">
    <h1>SaVanache</h1>
    <div  class="chromosomes-grid">
      <div v-for="(chromosome, index) in chromosomes" :key="index" @click="displayCurrentChrom(index, chromosome)" >
            <Chart :chromosome="chromosome" :index="index" :colorRange="colorRange" :source="source" :sourceByColor="sourceByColor" :target="getTargetByChrom(index)"/>
      </div>
    </div>
    <hr>
    <div>
        <Chromosome v-if="display" :name="name" :chromosome="chromosome" :colorRange="colorRange" :source="source" :getColorScale="getColorScale" />
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import Chart from "./components/Chart.vue";
import Chromosome from './components/Chromosome.vue';
import chromosomes from "./chromosomes.json"
import sources from "./sources.json"
import { getColor, matchingValue } from "./helpers/helpers.js"

export default {
  name: "App",
  components: {
    Chart: Chart,
    Chromosome: Chromosome,
  },
  data() {
    return {
      chromosomes,
      sources,
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
      chromosome: {},
      sourceByColor: [],
      fullSourceTargetColor: []
    }
  },
   mounted() {
    this.sources.map(el => {
       return this.sources.push(Object.assign({}, {svID: el.svID, sourceName: el.targetName, sourceStart: el.targetStart, sourceStop: el.targetStop, strand: el.strand === "+"? "-": "+", targetName: el.sourceName, targetStart: el.sourceStart, targetStop: el.sourceStop} ))
    }) 
  },
  methods: {
    getColor,
    matchingValue,
    getElementsBySources () {
        let duplicateSources = []
        this.sources.map(element => {
          return this.name === element.sourceName || this.name === element.targetName ? duplicateSources.push(element) : ""
        })
        if (duplicateSources.length === 0) return null;
        this.source = duplicateSources
    },
    getDataColorSource() {
      return this.getColor(this.source, this.chromosome, this.getColorScale)
    },
    getTargetBySource() {
        let getColorSc = this.getColorScale
        let arrayDataColorSource = this.getDataColorSource()
        const result = this.source.filter((item) => arrayDataColorSource.some(element => item.sourceName === element.sourceName))
        let indexColorStartInScale = []
        let indexColorStopInScale = []
        
        indexColorStartInScale.push(arrayDataColorSource.map(e => getColorSc.indexOf(e.colorStart)))
        indexColorStopInScale.push(arrayDataColorSource.map(e => getColorSc.indexOf(e.colorStop)))

        return result.map((item, i) => Object.assign({}, {svID: item.svID, sourceName: item.sourceName, sourceStart: item.sourceStart, sourceStop: item.sourceStop, strand: item.strand, targetName: item.targetName, targetStart: item.targetStart, targetStop: item.targetStop, colorStart: arrayDataColorSource[i].colorStart, colorStop: arrayDataColorSource[i].colorStop, colorRangeRgb: getColorSc.slice(indexColorStartInScale[0][i], indexColorStopInScale[0][i]+1)} ));
    },
    getTargetByChrom (index) {
      let result = []
       this.fullSourceTargetColor.filter(el => {
          if(el.targetName === index) {
              result.push(Object.assign({}, {svID: el.svID, sourceName: el.sourceName, sourceStart: el.sourceStart, sourceStop: el.sourceStop, strand: el.strand, targetName: el.targetName, targetStart: el.targetStart, targetStop: el.targetStop, colorStart: el.colorStart, colorStop: el.colorStop, colorRangeRgb: el.colorRangeRgb} ))
          } 
       })
       return result
    },
    displayCurrentChrom(id, chrom) {
        this.name = id
        this.chromosome = chrom
        this.display = true
        this.getElementsBySources()
        this.sourceByColor = this.getDataColorSource()
        this.fullSourceTargetColor = this.getTargetBySource()
    }
  },
  computed: {
    getColorScale(){
        let domainArr = []
        this.colorRange.map((_,i) => {
            let divided = d3.max(this.chromosome, (d => d.position))/(this.colorRange.length-1)
            domainArr.push(divided*i++)
        })
        let colorScale = d3.scaleLinear()
                      .domain(domainArr)
                      .range(this.colorRange)
        return this.chromosome.map(d => colorScale(d.position))             
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
<template>
  <div class="container">
    <div class="menu">
        <TargetScale />
    </div>
    <div class="charts">
      <h1>SaVanache</h1>
      <div  class="chromosomes-grid">
        <div v-for="(chromosome, index) in chromosomes" :key="index" @click="displayCurrentChrom(index, chromosome)" >
          <Chart :chromosome="chromosome" :index="index" :colorRange="colorRange" :source="source" :target="getTargetByChrom(index)" :chartWidth="chartWidth"/>
        </div>
      </div>
      
      <hr>
      <div>
          <Chromosome v-if="display" :name="name" :chromosome="chromosome" :colorRange="colorRange" :source="source" :height="height" :width="width" :x1AsPption="x1AsPption" :preX1="preX1" :x2AsPption="x2AsPption" :postX2="postX2" :colorGrey="colorGrey" :colorBlack="colorBlack" />
      </div>
      <div>
        <Table v-if="display && getListTableOfTargetChrom().length>0" :getListTableOfTargetChrom="getListTableOfTargetChrom()" />
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { mapState,mapGetters} from "vuex";
import Chart from "./components/Chart.vue";
import Chromosome from './components/Chromosome.vue';
import Table from './components/Table.vue';
import TargetScale from './components/TargetScale.vue';
import { closestPosition, getReverseArr } from './helpers/helpers'

export default {
  name: "App",
  components: {
    Chart: Chart,
    Chromosome: Chromosome,
    Table: Table,
    TargetScale: TargetScale
  },
  data() {
    return {
      display: false,   
      name:"",
      colorGrey: "rgb(128, 128, 128)",
      colorBlack: "rgb(0, 0, 0)",
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
        //inside sources array I add target as source (I revert target and source)
        return this.sources.push(Object.assign({}, {svID: el.svID, sourceName: el.targetName, sourceStart: el.targetStart, sourceStop: el.targetStop, strand: el.strand, targetName: el.sourceName, targetStart: el.sourceStart , targetStop: el.sourceStop }))
      }) 
      this.sources.map((_, i) => givesId.push(i+1))
       // With newSources I add id and a new svID structure of id
      const newSources = this.sources.map((el, i) => Object.assign({}, {id: givesId[i], svID: givesId[i]+"_"+el.sourceName+"_"+el.targetName, sourceName: el.sourceName, sourceStart: el.sourceStart, sourceStop: el.sourceStop, strand: el.strand, targetName: el.targetName, targetStart: el.targetStart, targetStop: el.targetStop} ));
      this.newSources =  newSources
  },
  methods: {
      closestPosition,
      getReverseArr,
      getRangeDomainBetweenX1X2() {
        //It's the range on chroUnit I need to build my getDomainArr function
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
        //This function build an array with the full domain used on my getColorScale function
        const max = d3.max(this.chromosome, (d => d.position))
        let domainArr = [0]

        let x1InChroUnit=(this.x1*max)/this.width
        let leftClampSizeInChroUnit = (this.x1AsPption-this.preX1)*max
        let left = x1InChroUnit - leftClampSizeInChroUnit
        
        domainArr.push(left, left, x1InChroUnit)
        let rightClampSizeInChroUnit = (this.postX2-this.x2AsPption)*max
        let x2InChroUnit=(this.x2*max)/this.width
        let right = x2InChroUnit + rightClampSizeInChroUnit
        this.getRangeDomainBetweenX1X2().map(e=>domainArr.push(e))
        domainArr.push(x2InChroUnit, right, right, max)

        return domainArr 
      },
      getColorRangeDrag() {
        //here I create an array of color range that I need inside my getColorScale function
        let colorArray = [this.colorGrey, this.colorGrey, this.colorBlack, this.colorBlack]
        this.colorRange.map(e=>colorArray.push(e))
        colorArray.push(this.colorBlack, this.colorBlack, this.colorGrey, this.colorGrey)
        return colorArray
      },
      checkSourceBetweenX1X2(el) {
        //I check if my source variation is between X1 and X2, positions of the drag left and drag right
        const max = d3.max(this.chromosome, (d => d.position))
        let x1InChroUnit=(this.x1*max)/this.width
        let x2InChroUnit=(this.x2*max)/this.width
        if((el.sourceStart && el.sourceStop)>x1InChroUnit &&(el.sourceStart && el.sourceStop)<x2InChroUnit) {
          return true
        }
      },
      getMaxValue() {
        //I need this condition to display the target that have a size >= 10000000
        let valueMax;
        if(this.valueX2Unit>=10000000) {
          valueMax = 10000000
        }
        return valueMax
      },
      checkTargetByScale(el) {
        // I check if the size of the target is between the X1 and X2 of the slider menu
        const difference = el.targetStop - el.targetStart
        if((this.valueX1Unit<=difference && this.valueX2Unit>=difference) || (this.valueX1Unit<=difference && this.getMaxValue() < difference)) {
          return true
        }
      },
      getElementsBySources (index) {
        // Here I get an array of SV with sourceName egal to the chromosome clicked
          let elementsBySources = [] 
          this.newSources.map(item => {
            return index === item.sourceName ? elementsBySources.push( Object.assign({}, {id: item.id, svID: item.svID, sourceName: item.sourceName, sourceStart: item.sourceStart, sourceStop: item.sourceStop, strand: item.strand, targetName: item.targetName, targetStart: item.targetStart, targetStop: item.targetStop, colorStart: this.getColorScale(item.sourceStart), colorStop: this.getColorScale(item.sourceStop)})) : null
          })
          return elementsBySources  
      },
      getColorStartIndex(start) {
        //I'm getting the index of colorStart to get a range of color between start and stop with the slice method inside getTargetByChrom()
        let indexColorStartInScale;
        indexColorStartInScale = this.getRangeDomainBetweenX1X2().indexOf(this.closestPosition(this.getRangeDomainBetweenX1X2(), start))
        this.colorRange.map((_, i ) => {
            if(i===indexColorStartInScale) {
              return indexColorStartInScale
            }
        })
        return indexColorStartInScale
      },
      getColorStopIndex(stop) {
        //I'm getting the index of colorStop to get a range of color between start and stop with the slice method inside getTargetByChrom()
        let indexColorStopInScale;
        indexColorStopInScale = this.getRangeDomainBetweenX1X2().indexOf(this.closestPosition(this.getRangeDomainBetweenX1X2(), stop))
        this.colorRange.map((_, i ) => {
            if(i===indexColorStopInScale) {
              return indexColorStopInScale
            }

        })
        return indexColorStopInScale
      },
      getTargetByChrom (index) {
          //I build a new array for each source clicked to get the targets according to the name, to the drag (checkSourceBetweenX1X2) and to the slider menu (checkTargetByScale) filters
          //I have one array by targetName to display each targets by chart
          let result = []
          this.source.map((el) => {
              if(el.targetName === index && this.checkSourceBetweenX1X2(el) && this.checkTargetByScale(el)) {
                  result.push(Object.assign({}, {id: el.id, svID: el.svID, sourceName: el.sourceName, sourceStart: el.sourceStart, sourceStop: el.sourceStop, strand: el.strand, targetName: el.targetName, targetStart: el.targetStart, targetStop: el.targetStop, colorStart: this.getColorScale(el.sourceStart), colorStop: this.getColorScale(el.sourceStop), colorRangeRgb: el.strand === "+" ? this.colorRange.slice(this.getColorStartIndex(el.sourceStart), this.getColorStopIndex(el.sourceStop)+1)  : this.getReverseArr(this.colorRange.slice(this.getColorStartIndex(el.sourceStart), this.getColorStopIndex(el.sourceStop)+1))} ))
              } 
          })
          return result
      },
      getListTableOfTargetChrom(){
        //Here I need only one array with all the targets by source with the filters to display on the table
        let result = []
        this.source.map(el => {
          if(this.checkSourceBetweenX1X2(el) && this.checkTargetByScale(el)) {
            result.push(Object.assign({}, {id: el.id, svID: el.svID, sourceName: el.sourceName, sourceStart: el.sourceStart, sourceStop: el.sourceStop, strand: el.strand, targetName: el.targetName, targetStart: el.targetStart, targetStop: el.targetStop} ))
          }
        })
        return result       
      },      
      displayCurrentChrom(id, chrom) {
        //Toggle function to display the chromosome clicked
          this.name = id
          this.chromosome = chrom
          this.display = true
          this.source = this.getElementsBySources(id)
      }
  },
  computed: {
      ...mapState({
        x1: 'x1',
        x2: 'x2',
        valueX1Unit: 'valueX1Unit',
        valueX2Unit: 'valueX2Unit'
      }),
      ...mapGetters({
        x1AsPption: 'getX1AsPption',
        preX1: 'getPreX1',
        x2AsPption: 'getX2AsPption',
        postX2: 'getPostX2'
      }),
      getColorScale() {
        // d3.js color scale
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
      display: flex;
      margin: 0 auto;
      width: 100%;
      text-align: center;
      .menu {
        width: 25%;
      }

      .charts {
        width: 75%;
        height: 1200px;
        border-left: 1px solid rgb(204, 204, 204);
        
          h1 {
            margin-bottom: 0;
          }

          hr {
            margin: 40px 0;
            border-top: 1px solid rgb(204, 204, 204);
          }

          .chromosomes-grid {
            margin: 0 auto;
            padding-bottom: 2rem;
            width: 95%;
            display: grid;
            grid-template-columns: repeat(24, 1fr);
            grid-template-rows: 1fr;
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
}


</style>
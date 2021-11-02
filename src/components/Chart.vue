<template>
  <div id="chart-vue"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Chart",
  props: {
    chromosome: {
      type: Object
    }
  },
  // created () {
  //     Object.entries(this.chromosomes).forEach(
  //       ([key]) => {
  //         let data = this.chromosomes[key]
  //         let data2 = { name : key};
  //         for (let i = 0; i < data.length; i++) {
  //               data[i] = Object.assign(data[i], data2);
  //         }
          
  //         this.chromosomeList.push(data)
  //       }
  
  //   );
  // },
  mounted() {
          // set the dimensions and margins of the graph
      var margin = {top: 30, right: 0, bottom: 30, left: 50},
          width = 210 - margin.left - margin.right,
          height = 210 - margin.top - margin.bottom;

          //Read the data
            let data = this.chromosome



        // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
              var svg = d3.select("#chart-vue")

        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        


       var x = d3.scaleLinear()
                    .domain([0, 250000000])
                    .range([ 0, width ]);
                  svg.append("g")
                    .attr("transform", "translate(0," + height + ")")

                  // Add Y axis
                  var y = d3.scaleLinear()
                    .domain([0, 85000])
                    .range([ height, 0 ]);
                  svg.append("g")
 
                    // Add the line
                    svg.append("path")
                      .datum(data)
                      .attr("fill", "none")
                      .attr("stroke", "steelblue")
                      .attr("stroke-width", 1.5)
                      .attr("d", d3.line()
                        .x(function(d) { return x(d.position) })
                        .y(function(d) { return y(d.varIndex) })
                        )



  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

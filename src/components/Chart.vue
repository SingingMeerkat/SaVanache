<template>
  <div id="chart-vue"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Chart",
  mounted() {
    // set the dimensions and margins of the graph
      var margin = {top: 10, right: 30, bottom: 30, left: 60},
          width = 1000 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3.select("#chart-vue")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

                  //Read the data
      d3.csv("/variability_forChrom1.csv",

              // When reading the csv, I must format variables:
              function(d){
                return { position : d.position, varIndex : d.varIndex }
              }).then(

              // Now I can use this dataset:
                function(data) {
                  console.log(data)
                    // Add X axis --> it is a date format
                  var x = d3.scaleLinear()
                    .domain([0, 250000000])
                    .range([ 0, width ]);
                  svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                  // Add Y axis
                  var y = d3.scaleLinear()
                    .domain([0, 45000])
                    .range([ height, 0 ]);
                  svg.append("g")
                    .call(d3.axisLeft(y));

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

            })

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

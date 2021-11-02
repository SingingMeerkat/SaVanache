<template>
  <div>
    <h1>Try to display a chart with d3.js</h1> 
        <ul class="wrapper-grid">
          <li v-for="(chromosome, index) in chromosomes" :key="index">
            <Chart :chromosome="chromosome" />
          </li>
        </ul>
  </div>
</template>

<script>
import Chart from "./components/Chart.vue";
import chromosomes from "./data.json"
export default {
  name: "App",
  data() {
    return {
      chromosomes : chromosomes
    }
  },
  components: {
    Chart: Chart,
  },
};
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}

li {
  list-style: none;
}
</style>
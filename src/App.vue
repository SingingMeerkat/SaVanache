<template>
  <div class="container">
    <h1>Savanache</h1> 
    <div  class="chromosomes-grid">
      <div v-for="(chromosome, index) in chromosomes" :key="index">
          <Chart :chromosome="chromosome" :index="index" />
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "./components/Chart.vue";
import chromosomes from "./data.json"

export default {
  name: "App",
   components: {
    Chart: Chart,
  },
  data() {
    return {
      chromosomes : chromosomes,
    }
  },
 
};
</script>

<style lang="scss" scoped>

.container {
  width: 95%;
  margin: 0 auto;

  h1 {
    text-align: center;
  }

  .chromosomes-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: 1fr 1fr 1fr;
  }
}

</style>
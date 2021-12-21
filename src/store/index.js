import Vue from 'vue'
import Vuex from 'vuex'
import chromosomes from "../chromosomes.json"
import sources from "../sources.json"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    chromosomes : chromosomes,
    sources : sources,
    height: 400,
    width: 1200,
    chartWidth: 400,
    x1: 0,
    x2: 1200,
    x1Target:0,
    x2Target:500,
    valueX1Unit:50,
    valueX2Unit:10000000

  },
  mutations: {
    SET_X1(state, payload) {
      state.x1 = payload
    },
    SET_X2(state, payload) {
      state.x2 = payload
    },
    SET_X1TARGET(state, payload) {
      state.x1Target= payload
    },
    SET_X2TARGET(state, payload) {
      state.x2Target = payload
    },
    SET_VALUEX1UNIT(state, payload) {
      state.valueX1Unit= payload
    },
    SET_VALUEX2UNIT(state, payload) {
      state.valueX2Unit = payload
    },

  },
  actions: {
    updateX1({commit}, x1) {
      commit('SET_X1', x1)
    },
    updateX2({commit}, x2) {
      commit('SET_X2', x2)
    },
    updateX1Target({commit}, x1Target) {
      commit('SET_X1TARGET', x1Target)
    },
    updateX2Target({commit}, x2Target) {
      commit('SET_X2TARGET', x2Target)
    },
    updateValueX1Unit({commit}, valueX1Unit) {
      commit('SET_VALUEX1UNIT', valueX1Unit)
    },
    updateValueX2Unit({commit}, valueX2Unit) {
      commit('SET_VALUEX2UNIT', valueX2Unit)
    },
  },
  getters: {
    getX1AsPption: (state) => {
      return state.x1 / state.width;
    },
    getPreX1: (state, getters) =>{
      return Math.max(getters.getX1AsPption - 0.01, 0);
    },
    getX2AsPption: (state) => {
      return state.x2 / state.width;
    },
    getPostX2: (state, getters) => {
      return Math.min(getters.getX2AsPption + 0.01, state.width);
    }

  },
  modules: {
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import chromosomes from "../chromosomes.json"
import sources from "../sources.json"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    chromosomes : chromosomes,
    sources : sources,
    height: 480,
    width: 1200,
    chartWidth: 400,
    x1: 0,
    x2: 1200,
    localAreaSelected: [1, 10000000],
  },
  mutations: {
    SET_X1(state, payload) {
      state.x1 = payload
    },
    SET_X2(state, payload) {
      state.x2 = payload
    },
    SET_LOCAL_AREA_SELECTED(state, payload) {
      state.localAreaSelected = payload
    },

  },
  actions: {
    updateX1({commit}, x1) {
      commit('SET_X1', x1)
    },
    updateX2({commit}, x2) {
      commit('SET_X2', x2)
    },
    updateLocalAreaSelected({commit}, coordinates) {
      commit('SET_LOCAL_AREA_SELECTED', coordinates)
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

import Vue from "vue";
import Vuex from "vuex";
import common from './store/common';
import surname from './store/surname';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,surname,
  }
});

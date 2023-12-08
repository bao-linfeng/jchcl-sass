import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ADS from "./utils/ADS.js";
import Loading from './components/loading'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

Vue.filter("getLocalTime", ADS.getLocalTime);
Vue.filter("getTime", ADS.getTime);
Vue.filter("dateCalculation", ADS.dateCalculation);
Vue.prototype.logout = ADS.logout;

Vue.prototype.logout = ADS.logout;
Vue.prototype.getLocalStorage = ADS.getLocalStorage;
Vue.prototype.setLocalStorage = ADS.setLocalStorage;

Vue.config.productionTip = false;

Vue.use(Loading);
// Vue.use(ElementUI);

var vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

import Vue from "vue";
import Router from "vue-router";
import ADS from "./utils/ADS.js";

import Home from "./views/Home.vue";
import LinkPage from "./views/LinkPage.vue";
import SelectSurname from "./views/SelectSurname.vue";
import SurnameExplorer from "./views/SurnameExplorer.vue";
import SurnameEncyclopedia from "./views/SurnameEncyclopedia.vue";
import SurnamePopulation from "./views/SurnamePopulation.vue";
import ProgenyDistribution from "./views/ProgenyDistribution.vue";
import Celebrity from "./views/Celebrity.vue";
import CelebrityProfile from "./views/CelebrityProfile.vue";
import GenealogyCollection from "./views/GenealogyCollection.vue";
import CatalogSearch from './views/CatalogSearch.vue';
import GenealogySummary from "./views/GenealogySummary.vue";
import GenealogyView from "./views/GenealogyView.vue";
import FamilyDiscipline from "./views/FamilyDiscipline.vue";
import About from "./views/About.vue";
import SurnameSelect from "./views/SurnameSelect.vue";

Vue.use(Router);

const routes = [
  // {
  //   path: "/",
  //   name: "home",
  //   component: Home,
  //   meta: {
  //     requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  //     roles: ['admin', 'editor'],
  //   },
  //   beforeEnter:(to, from, next) => {
  //     if(to.path == '/'){
  //       next({path:('/LinkPage')});
  //     }else{
  //       next();
  //     }
  //   },
  //   children:[
  //     {
  //       path: "/LinkPage",
  //       name: "LinkPage",
  //       component: LinkPage
  //     },
  //   ],
  // },
  {
    path: "/SurnameSelect",
    name: "SurnameSelect",
    component: SurnameSelect
  },
  {
    path: "/CatalogSearch",
    name: "CatalogSearch",
    component: CatalogSearch
  },
  {
    path: "/",
    name: "LinkPage",
    component: LinkPage
  },
  {
    path: "/SelectSurname",
    name: "SelectSurname",
    component: SelectSurname
  },
  {
    path: "/SurnameExplorer",
    name: "SurnameExplorer",
    component: SurnameExplorer
  },
  {
    path: "/SurnameEncyclopedia",
    name: "SurnameEncyclopedia",
    component: SurnameEncyclopedia
  },
  {
    path: "/SurnamePopulation",
    name: "SurnamePopulation",
    component: SurnamePopulation
  },
  {
    path:'/ProgenyDistribution',
    name:'ProgenyDistribution',
    component:ProgenyDistribution,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    path:'/Celebrity',
    name:'/Celebrity',
    component:Celebrity
  },
  {
    path:'/CelebrityProfile',
    name:'CelebrityProfile',
    component:CelebrityProfile
  },
  {
    path:'/GenealogyCollection',
    name:'GenealogyCollection',
    component:GenealogyCollection
  },
  {
    path:'/gs',
    name:'GenealogySummary',
    component:GenealogySummary
  },
  {
    path:'/view',
    name:'GenealogyView',
    component:GenealogyView
  },
  {
    path:'/FamilyDiscipline',
    name:'FamilyDiscipline',
    component:FamilyDiscipline
  },
  {
    path:'/About',
    name:'About',
    component:About
  },
  {
    path: "/404",
    component: () => import("./views/NotFound.vue")
  },
  {
    path: "*",
    redirect: "/404"
  },
];

let router= new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes
});

// router.beforeEach((to, from, next) => {
//   if(to.path == '/'){
//     next({path:('/LinkPage')});
//   }else{
//     next();
//   }
// })

router.afterEach((to) => {
  window.scrollTo(0, 0);
});

export default router
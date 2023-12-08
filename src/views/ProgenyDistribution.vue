<template>
  <div class="heatmap">
    <Percentmap />
    <AdaiTitle :style="{position:'absolute',zIndex:100,top:0,left:0,width:'50%'}" :theme="'theme'" :path="'/SurnameExplorer?s='+surname+'&py='+pinyin" :title="surname+(surO[surname] ? '('+surO[surname]+')' : '')+'氏分布'" :titleE="'Descendant distribution'" />
  </div>
</template>

<script>
import Percentmap from "../components/map/Percentmap.vue";
import AdaiTitle from "../components/adai/AdaiTitle.vue";
import ADS from "../utils/ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "ProgenyDistribution",
    components: {
        Percentmap,AdaiTitle
    },
    data: () => {
        return {
            pinyin:'',
            surname:'',
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname;
        this.pinyin = pinyin;
    },
    
    methods: {
        
    },
    computed: {
        ...mapState({
            surnameDetail: state => state.surname.surnameDetail,
            surSummary: state => state.surname.surSummary,
            surO: state => state.surname.surO,
        })
    },
    watch:{
        '$route':function(to,from){
            if(to.name == 'ProgenyDistribution' && to.query.s != this.surname){
                this.surname = to.query.s;
                this.pinyin = to.query.py || '';
            }
        },
    },
};
</script>
<style scoped lang="scss">
.heatmap{
    position: relative;
    width: 100%;
    height: 100%;
}
</style>


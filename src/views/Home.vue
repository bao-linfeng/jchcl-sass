<template>
  <div class="home_wrap">
    <keep-alive>
      <router-view :key="key" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view :key="key" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "home",
  components: {
    
  },
  data: () => {
    return {
      
    };
  },
  created:function(){
    
  },
  methods:{
    
  },
  computed: {
    key() {
        return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
    }
  },
  watch:{
    '$route': function (to, from) {
      //console.log(to);
　　}
  },
};
</script>
<style scoped lang="scss">
.home_wrap{
  position: relative;
  width: 100%;
  height: 100%;
  width: 100%;
  height: 100%;
}
</style>
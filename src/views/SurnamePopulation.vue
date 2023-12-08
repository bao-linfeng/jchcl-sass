<template>
    <div class="surnamePopulation_wrap">
        <AdaiCarousel :imgs="[1]" :name="'3'" />
        <AdaiTitle :path="'/SurnameExplorer?s='+surnameN+'&py='+pinyinN" :title="'姓氏人口'" :titleE="'Surname population'" />
        <div class="surnamePopulation_wrap_content">
            <ul class="surnamePopulation_wrap_content_surname" v-show="!isTrue">
                <li v-for="(item,index) in surname" :key="'surname'+index">
                    <div class="KaiTi">{{item}}</div>
                    <span class="fontSize50 MuseoSlab300">{{pinyin ? pinyin.split(' ')[index] : ''}}</span>
                </li>
                <li v-if="surO[surname]">
                    <div class="KaiTi">{{surO[surname]}}</div>
                    <span class="fontSize50 MuseoSlab300">{{pinyin}}</span>
                </li>
            </ul>
            <ul class="surnamePopulation_wrap_content_surname_sort" v-show="isTrue" @scroll.passive="onScroll">
                <li class="surnamePopulation_wrap_content_surname_sort_t">
                    <h3 class="fontSize38 PingFangSC_Medium">常见姓氏排名</h3>
                    <!-- <p class="fontSize26 MuseoSlab300">Most popular names</p> -->
                </li>
                <div class="surname-li style1">
                  <li v-for="(item,index) in surnameSortList" :key="'popular_names'+index" class="fontSize38 PingFang_Regular" :id="'s'+index" :class="{active:surname==item.hz}" @click="changeSurnameSort(index)" :title="item.hz"><span>{{index+1}}. {{item.hz}}{{item.same ? ('('+item.same+')') : ''}} {{item.py}}</span><i></i></li>
                </div>
            </ul>
            <div class="surnamePopulation_wrap_content_total" id="share" v-show="!isTrue">
                <div class="surnamePopulation_wrap_content_total_title marginTop50">
                    <h3 class="fontSize60 PingFangSC_Medium">有多少人与{{surname}}同姓？</h3>
                    <!-- <p class="fontSize26 MuseoSlab300">How many people share your family name</p> -->
                </div>
                <div class="surnamePopulation_wrap_content_total_cai">
                    <h3 class="fontSize48 PingFangSC_Medium">猜猜看</h3>
                    <!-- <p class="fontSize26 MuseoSlab300">Take a guess</p> -->
                </div>
                <ul class="surnamePopulation_wrap_content_total_xuanze">
                    <li v-for="(item,index) in surnameTotalArr" :key="'count'+index" @click="changeTotal(index)">
                        <img :src="require('../assets/surnamePopulation/check'+(surnameTotalTab === index ? '_active' : '')+'.svg')" alt="" />
                        <div>
                            <p class="fontSize48 PingFangSC_Medium">{{item.ZH}}{{item.same}}</p>
                            <!-- <span class="fontSize26 MuseoSlab300">{{item.EN}}</span> -->
                        </div>
                    </li>
                </ul>
                <p class="surnamePopulation_wrap_content_total_error fontSize30 PingFang_Regular" v-show="surnameTotalTab >= 0 && surnameTotalArr[surnameTotalTab]['ZH'] != surnameTotal.ZH">好可惜，猜错了，还差一点哦！</p>
            </div>
            <div class="surnamePopulation_wrap_content_total" v-show="isTrue" :class="{share_ok:surnameTotalTab >= 0 && surnameTotalArr[surnameTotalTab]['ZH'] == surnameTotal.ZH}">
                <!-- <div class="success_animation_wrap" id="success_animation_wrap">
                  <img v-for="(item,index) in 8" :key="'img_animation'+index" :src="require('../assets/surnamePopulation/'+index+'.png')" alt="">
                  <i v-for="(item,index) in 14" :key="'circle'+index"></i>
                </div> -->
                <div class="surnamePopulation_success_box">
                  <div class="surnamePopulation_wrap_content_total_title marginTop20">
                    <h3 class="fontSize60 PingFangSC_Medium" :class="{largeSize:surnameSortIndex > -1}">{{surnameSortIndex > -1 ? (surnameSortList[surnameSortIndex].hz+(surO[surname] ? '('+surO[surname]+')' : '')) : '恭喜你猜对啦！'}}</h3>
                    <span class="fontSize26 MuseoSlab300">{{surnameSortIndex > -1 ? surnameSortList[surnameSortIndex].py : 'You are right'}}</span>
                  </div>
                  <div class="paiming">
                    <h3 v-show="surnameSortIndex === -1">{{surname}}{{surO[surname] || ''}}氏排名</h3>
                    <p v-if="surnameSortIndex >= 500">大于500名</p>
                    <p v-else>第<span>{{surnameSortIndex > -1 ? surnameSortIndex+1 : surnameSortIndex+1}}</span>名</p>
                  </div>
                  <div class="surnamePopulation_wrap_content_total_ji">
                      <h3 class="fontSize48 PingFang_Regular">{{surnameSortIndex > -1 ? '' : (surname+(surO[surname] || '')+'氏')}}总人口大约为</h3>
                      <p>{{surnameTotal.ZH}}</p>
                      <!-- <span class="fontSize26 MuseoSlab300">Total population  is about {{surnameTotal.EN}}</span> -->
                  </div>
                  <!-- <router-link :to="'/ProgenyDistribution?s='+surname+'&py='+pinyin" class="surnamePopulation_wrap_content_total_right fontSize30 PingFang_Regular">快去看看这些人口分布在哪里吧！</router-link> -->
                </div>
            </div>
        </div>
        <AdaiFireMove v-if="isStartAnimate" />
        <audio class="audio_wrap" ref="success"><source src="../audio/success.mp3" type="audio/mpeg">您的浏览器不支持 audio 标签。</audio>
        <audio class="audio_wrap" ref="error"><source src="../audio/error.mp3" type="audio/mpeg">您的浏览器不支持 audio 标签。</audio>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import AdaiTitle from "../components/adai/AdaiTitle.vue";
import AdaiFireMove from "../components/adai/AdaiFireMove.vue";
import AdaiCarousel from "../components/adai/AdaiCarousel.vue";
export default {
    name: "surnamePopulation",
    components: {
        AdaiTitle,AdaiFireMove, AdaiCarousel, 
    },
    data: () => {
        return {
          isStartAnimate:false,
            pinyin:'',
            surname:'',
            surnameTotalTab:'-1',
            isTrue:false,
            page:1,
            limit:5000,
            surnameSortIndex: -1,
            share:'',
            success_animation_wrap:'',
            success:'',
            error:'',
            surnameN:'',
            pinyinN:'',
            startTime: 0,
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname;
        this.surnameN = surname;
        this.pinyin = pinyin;
        this.pinyinN = pinyin;
        this.startTime = Date.now();
    },
    mounted:function(){
        this.success = this.$refs.success;
        this.error = this.$refs.error;
        this.share = document.querySelector('#share');
        this.success_animation_wrap = document.querySelector('#success_animation_wrap');
        this.getSurnameTotal();
        this.getSurnameSort();
    },
    destroyed:function(){
      this.clickNum('姓氏人口', 'L1', Date.now() - this.startTime)
    },
    methods:{
      async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        onScroll(e){
          console.log(e.target.scrollTop);
        },
        changeSurnameSort(i){
            this.surnameSortIndex = Number(i);
            this.surname = this.surnameSortList[i].hz;
            this.pinyin = this.surnameSortList[i].py;
            this.getSurnameTotal();
        },
        changeTotal(i){
            this.surnameTotalTab = i;
            this.share.classList.remove('share');
            if(this.surnameTotalTab >= 0 && this.surnameTotalArr[this.surnameTotalTab]['ZH'] == this.surnameTotal.ZH){
                this.isTrue = true;
                this.isStartAnimate = true;
                // this.success.play();
                // this.getSurnameSort();
                // this.success_animation_wrap.classList.add('success_animation');
                this.surnameSortList.map((item,index)=>{
                  if(item.hz == this.surname && index - 4 >= 0){
                      setTimeout(()=>{document.getElementById('s'+(index - 4)).scrollIntoView();},500)
                  }
              });
            }else{
                this.isTrue = false;
                // this.error.play();
                setTimeout(()=>{this.share.classList.add('share')},300);
            }
        },
        getSurnameTotal(){
          this.$store.dispatch('getSurnameTotal',{url:'https://home.qingtime.cn/surname/surname/sort',body:{page:this.page,limit:this.limit,surname:this.surname}});
            // this.$store.dispatch('getSurnameTotal',{url:'https://kintime.qingtime.cn/sgbh/pkSurname/surnameStatisticsArea',body:{token:'MQQFW8B8J74KTTLF16AOK7AHRFHN2QZRB9KU83EI6EEWIFM81567577000106',surname:this.surname}});
        },
        getSurnameSort(){
            this.$store.dispatch('getSurnameSort',{url:'https://home.qingtime.cn/surname/surname/sort',body:{page:this.page,limit:this.limit,isFont:1}});
        },
    },
    computed: {
        ...mapState({
            surnameSortList: state => state.surname.surnameSortList,
            surnameSortPages: state => state.surname.surnameSortPages,
            surnameTotal: state => state.surname.surnameTotal,
            surnameTotalArr: state => state.surname.surnameTotalArr,
            surO: state => state.surname.surO,
        })
    },
    watch:{
        'surnameSortList':function(newV,oldV){
            newV.map((item,index)=>{
              if(item.hz == this.surname){
                this.surnameSortIndex = index;
              }
                // if(item.hz == this.surname && index - 4 >= 0){
                //     setTimeout(()=>{document.getElementById('s'+(index - 4)).scrollIntoView();},2000)
                // }
            });
        },
    },
};
</script>
<style>
.surnamePopulation_wrap{
    position: relative;
    width: 100%;
    height: 100%;
    /* background: #999 url('../assets/surnamePopulation/bg.jpg') 50% 50% no-repeat;
    background-size: cover; */
}
.surnamePopulation_wrap_content{
    position: absolute;
    top: 181px;
    right: 0;
    bottom: 0;
    left:0;
    /* width: calc(100% - 216px);
    height: calc(100% - 181px); */
    padding: 0 108px;
    /* overflow: hidden; */
    display: flex;
}
.surnamePopulation_wrap_content_surname{
    width: 400px;
    display: inline-block;
    color: #fff;
    font-size: 50px;
}
.surnamePopulation_wrap_content_surname li{
    margin-bottom: 10px;
    text-align: center;
    margin-right: 10px;
    /* display: flex;
    align-items: flex-end; */
}
.surnamePopulation_wrap_content_surname div{
    width: 220px;
    height: 220px;
    line-height: 205px;
    background: url('../assets/surnameExplorer/tian.svg') 50% 50% no-repeat;
    font-size: 190px;
}
.surnamePopulation_wrap_content_surname span{
    height: 50px;
    line-height: 50px;
    width: 220px;
    display: block;
    text-align: center;
}
.surnamePopulation_wrap_content_surname_sort{
    position: relative;
    display: block;
    width: 400px;
    height: calc(100% - 50px);
    padding: 0 0 40px 0;
    color: #999;
    border-top: 10px solid #5CB483;
    background: rgba(255,255,255,0.80);
    overflow: hidden;
}
.surname-li{
  position: relative;
  width: 100%;
  height: calc(100% - 133px);
  overflow-y: auto;
  overflow-x: hidden;
}
.surnamePopulation_wrap_content_surname_sort li{
    height: 74px;
    line-height: 74px;
    cursor: pointer;
}
.surnamePopulation_wrap_content_surname_sort li span{
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-indent: 20px;
}
.surnamePopulation_wrap_content_surname_sort i{
  display: none;
}
.surnamePopulation_wrap_content_surname_sort li.active{
    position: relative;
    background-color: #5CB483;
    color: #fff;
}
.surnamePopulation_wrap_content_surname_sort li.active i{
  position: absolute;
  top: 0;
  right: -74px;
  width: 0;
  height: 0;
  border: 37px solid;
  border-color: transparent transparent transparent #5CB483;
  display: block;
}
.surnamePopulation_wrap_content_surname_sort li.surnamePopulation_wrap_content_surname_sort_t{
    height: auto;
    line-height: normal;
    width: calc(100% - 80px);
    padding: 40px 40px 0 40px;
    margin-bottom: 10px;
}
.surnamePopulation_wrap_content_surname_sort_t h3{
    color: #5CB483;
}
.paiming h3{
  font-size: 30px;
  color: #333;
  margin: 50px 0 10px 0;
}
.paiming p{
  color: #5CB483;
  font-size: 36px;
}
.paiming span{
  font-size: 150px;
}
.surnamePopulation_wrap_content_total{
  position: relative;
    width: 850px;
    height: calc(100% - 100px);
    background: rgba(255,255,255,0.80);
    border-radius: 7.5px;
    text-align: center;
    padding: 50px 125px;
    margin-left: 100px;
}
.surnamePopulation_wrap_content_total_title{
  height: 204px;
    color: #5CB483;
}
.marginTop50{
  margin-top: 100px;
}
.marginTop20{
  margin-top: 40px;
}
.surnamePopulation_wrap_content_total_title span{
    color: #999;
}
.surnamePopulation_wrap_content_total_cai{
    margin: -30px 0 40px 0;
}
.surnamePopulation_wrap_content_total_cai span{
    color: #666;
}
.surnamePopulation_wrap_content_total_ji{
    margin: 20px 0 0 0;
    color: #999;
}
.surnamePopulation_wrap_content_total_ji h3{
    color: #000;
}
.surnamePopulation_wrap_content_total_ji p{
    color: #5CB483;
    font-size: 15rem;
    margin-top: 15px;
}
.surnamePopulation_wrap_content_total_ji span{
  z-index: 100000;
}
.surnamePopulation_wrap_content_total_xuanze{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    text-align: left;
    justify-content: space-between;
}
.surnamePopulation_wrap_content_total_xuanze li{
    display: flex;
    margin-bottom: 50px;
    width: 45%;
    cursor: pointer;
}
.surnamePopulation_wrap_content_total_xuanze img{
    margin-right: 20px;
}
.surnamePopulation_wrap_content_total_xuanze span{
    color: #999;
}
.surnamePopulation_wrap_content_total_error{
    color: #F16458;
}
.surnamePopulation_wrap_content_total_right{
    color: #333;
    margin-top: 40px;
    display: block;
}
.largeSize{
    font-size: 120px;
}
.surnamePopulation_success_box{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  padding: 50px 125px;
}
.success_animation_wrap{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* opacity: 0; */
  z-index: 0;
}
.success_animation_wrap img{
  position: absolute;
  /* animation: success_animate 1s ease-in-out; */
}
.success_animation_wrap img:nth-of-type(1){
  top: 63%;
  left: 40px;
  animation: icon-bounce 2s ease-in-out infinite;
}
.success_animation_wrap img:nth-of-type(2){
  top: 24%;
  left: 135px;
  animation: animate_move2 1.9s linear;
}
@keyframes animate_move2{
  from{
    /* transform: scale(0.1); */
    top: 0;
    left: 50%;
    opacity: 0;
  }
  to{
    /* transform: scale(1); */
    top: 24%;
    left: 135px;
    opacity: 1;
  }
}
.success_animation_wrap img:nth-of-type(3){
  top: 28%;
  left: 50px;
  animation: animate_move3 2.2s ease-in-out;
}
@keyframes animate_move3{
  from{
    /* transform: scale(0.1); */
    top: 0;
    left: 50%;
    opacity: 0;
  }
  to{
    /* transform: scale(1); */
    top: 28%;
    left: 50px;
    opacity: 1;
  }
}
.success_animation_wrap img:nth-of-type(4){
  top: 26%;
  left: 200px;
  animation: animate_move4 2s ease-in-out;
}
@keyframes animate_move4{
  from{
    /* transform: scale(0.1); */
    top: 0;
    left: 50%;
    opacity: 0;
  }
  to{
    /* transform: scale(1); */
    top: 26%;
    left: 200px;
    opacity: 1;
  }
}
.success_animation_wrap img:nth-of-type(5){
  top: 40%;
  right: -60px;
  animation: icon-bounce 2s ease-in-out infinite;
}
.success_animation_wrap img:nth-of-type(6){
  top: 24%;
  right: 40px;
  animation: animate_move6 2.1s ease-in-out;
}
@keyframes animate_move6{
  from{
    /* transform: scale(0.1); */
    top: 0;
    right: 50%;
    opacity: 0;
  }
  to{
    /* transform: scale(1); */
    top: 24%;
    right: 40px;
    opacity: 1;
  }
}
.success_animation_wrap img:nth-of-type(7){
  top: 32%;
  right: 80px;
  animation: animate_move7 2s ease-in-out;
}
@keyframes animate_move7{
  from{
    /* transform: scale(0.1); */
    top: 0;
    right: 50%;
    opacity: 0;
  }
  to{
    /* transform: scale(1); */
    top: 32%;
    right: 80px;
    opacity: 1;
  }
}
.success_animation_wrap img:nth-of-type(8){
  top: 26%;
  right: 140px;
  animation: animate_move8 1.8s ease-in-out;
}
@keyframes animate_move8{
  from{
    /* transform: scale(0.1); */
    top: 0;
    right: 50%;
    opacity: 0;
  }
  to{
    /* transform: scale(1); */
    top: 26%;
    right: 140px;
    opacity: 1;
  }
}
.success_animation_wrap i{
  position: absolute;
  display: block;
  width: 16px;
  height: 16px;
  background: #009944;
  border-radius: 50%;
  /* animation: animate_scale 2s ease-in-out infinite; */
  display: none;
}
@keyframes animate_scale{
  from{
    transform: scale(0.5);
    opacity: 0.2;
  }
  to{
    transform: scale(1);
    opacity: 1;
  }
}
.success_animation_wrap i:nth-of-type(1){
  top: 160px;
  left: -84px;
}
.success_animation_wrap i:nth-of-type(2){
  top: 150px;
  left: 132px;
}
.success_animation_wrap i:nth-of-type(3){
  top: 130px;
  left: 310px;
  background: #D60050;
}
.success_animation_wrap i:nth-of-type(4){
  top: 236px;
  left: 112px;
  width: 12px;
  height: 12px;
  background: #E51773;
}
.success_animation_wrap i:nth-of-type(5){
  top: 373px;
  left: 322px;
  width: 12px;
  height: 12px;
  background: #E51773;
}
.success_animation_wrap i:nth-of-type(6){
  top: 490px;
  left: 267px;
  width: 14px;
  height: 14px;
  background: #00A0E8;
}
.success_animation_wrap i:nth-of-type(7){
  top: 494px;
  left: 18px;
  width: 18px;
  height: 18px;
  background: #E51773;
}
.success_animation_wrap i:nth-of-type(8){
  top: 95px;
  right: 52px;
  width: 14px;
  height: 14px;
  background: #FFF000;
}
.success_animation_wrap i:nth-of-type(9){
  top: 130px;
  right: 236px;
}
.success_animation_wrap i:nth-of-type(10){
  top: 200px;
  right: 326px;
  width: 12px;
  height: 12px;
  background: #D60050;
}
.success_animation_wrap i:nth-of-type(11){
  top: 482px;
  right: 122px;
  width: 20px;
  height: 20px;
  background: #E51773;
}
.success_animation_wrap i:nth-of-type(12){
  top: 482px;
  right: -84px;
}
.success_animation_wrap i:nth-of-type(13){
  top: 536px;
  right: 8px;
  width: 12px;
  height: 12px;
  background: #E51773;
}
.success_animation_wrap i:nth-of-type(14){
  top: 635px;
  right: 94px;
}
.success_animation{
  animation: success_animation 1s ease-in-out;
}
/* @keyframes success_animation{
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
} */
.share{
    animation: shake-slow 0.5s ease-in-out;
}
@keyframes icon-bounce {
  0%, 100% {
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
 
  25% {
    -moz-transform: rotate(5deg);
    -ms-transform: rotate(5deg);
    -webkit-transform: rotate(5deg);
    transform: rotate(5deg);
  }
 
  50% {
    -moz-transform: rotate(-5deg);
    -ms-transform: rotate(-5deg);
    -webkit-transform: rotate(-5deg);
    transform: rotate(-5deg);
  }
 
  75% {
    -moz-transform: rotate(3deg);
    -ms-transform: rotate(3deg);
    -webkit-transform: rotate(3deg);
    transform: rotate(3deg);
  }
 
  85% {
    -moz-transform: rotate(-3deg);
    -ms-transform: rotate(-3deg);
    -webkit-transform: rotate(-3deg);
    transform: rotate(-3deg);
  }
}
@keyframes shake-slow {
   0% {
     transform: translate(0px, 0px) rotate(0deg);
   }
   2% {
     transform: translate(-1px, 8px) rotate(1.5deg);
   }
   4% {
     transform: translate(7px, 0px) rotate(-0.5deg);
   }
   6% {
     transform: translate(8px, 8px) rotate(-3.5deg);
   }
   8% {
     transform: translate(-4px, -3px) rotate(-1.5deg);
   }
   10% {
     transform: translate(5px, 0px) rotate(-2.5deg);
   }
   12% {
     transform: translate(-10px, -3px) rotate(-3.5deg);
   }
   14% {
     transform: translate(5px, 7px) rotate(2.5deg);
   }
   16% {
     transform: translate(8px, -8px) rotate(-1.5deg);
   }
   18% {
     transform: translate(9px, -6px) rotate(-3.5deg);
   }
   20% {
     transform: translate(3px, 1px) rotate(-0.5deg);
   }
   22% {
     transform: translate(6px, 8px) rotate(-2.5deg);
   }
   24% {
     transform: translate(-8px, -1px) rotate(2.5deg);
   }
   26% {
     transform: translate(7px, -10px) rotate(0.5deg);
   }
   28% {
     transform: translate(7px, -4px) rotate(-3.5deg);
   }
   30% {
     transform: translate(-2px, -6px) rotate(-1.5deg);
   }
   32% {
     transform: translate(-1px, 0px) rotate(2.5deg);
   }
   34% {
     transform: translate(6px, 2px) rotate(-0.5deg);
   }
   36% {
     transform: translate(2px, 7px) rotate(1.5deg);
   }
   38% {
     transform: translate(2px, -9px) rotate(1.5deg);
   }
   40% {
     transform: translate(-5px, -1px) rotate(-0.5deg);
   }
   42% {
     transform: translate(-8px, 2px) rotate(-0.5deg);
   }
   44% {
     transform: translate(-4px, 3px) rotate(0.5deg);
   }
   46% {
     transform: translate(-10px, -2px) rotate(-0.5deg);
   }
   48% {
     transform: translate(1px, 9px) rotate(1.5deg);
   }
   50% {
     transform: translate(6px, 7px) rotate(1.5deg);
   }
   52% {
     transform: translate(-8px, 4px) rotate(0.5deg);
   }
   54% {
     transform: translate(6px, -8px) rotate(-2.5deg);
   }
   56% {
     transform: translate(2px, -9px) rotate(-2.5deg);
   }
   58% {
     transform: translate(-2px, -9px) rotate(0.5deg);
   }
   60% {
     transform: translate(2px, 7px) rotate(-0.5deg);
   }
   62% {
     transform: translate(0px, 0px) rotate(-1.5deg);
   }
   64% {
     transform: translate(-9px, -4px) rotate(-3.5deg);
   }
   66% {
     transform: translate(6px, -6px) rotate(0.5deg);
   }
   68% {
     transform: translate(0px, -7px) rotate(-2.5deg);
   }
   70% {
     transform: translate(-10px, 1px) rotate(1.5deg);
   }
   72% {
     transform: translate(-7px, 9px) rotate(2.5deg);
   }
   74% {
     transform: translate(2px, -6px) rotate(-0.5deg);
   }
   76% {
     transform: translate(5px, 1px) rotate(-0.5deg);
   }
   78% {
     transform: translate(-1px, 5px) rotate(2.5deg);
   }
   80% {
     transform: translate(3px, 7px) rotate(2.5deg);
   }
   82% {
     transform: translate(-6px, -7px) rotate(-0.5deg);
   }
   84% {
     transform: translate(-8px, 8px) rotate(-2.5deg);
   }
   86% {
     transform: translate(8px, 3px) rotate(-2.5deg);
   }
   88% {
     transform: translate(-8px, 3px) rotate(-1.5deg);
   }
   90% {
     transform: translate(-7px, -4px) rotate(-3.5deg);
   }
   92% {
     transform: translate(-8px, 4px) rotate(2.5deg);
   }
   94% {
     transform: translate(-6px, -6px) rotate(-3.5deg);
   }
   96% {
     transform: translate(-3px, 2px) rotate(-3.5deg);
   }
   98% {
     transform: translate(2px, 1px) rotate(-0.5deg);
   }
}
.audio_wrap{
  position: fixed;
  top: -10000px;
  left: -30000px;
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
  .surnamePopulation_wrap_content{
    top: 120px;
    padding: 0 64px;
  }
  .surnamePopulation_wrap_content_surname div{
    width: 132px;
    height: 132px;
    line-height: 130px;
    font-size: 114px;
    background-size: cover;
  }
  .surnamePopulation_wrap_content_surname span{
    width: 132px;
  }
  .surnamePopulation_wrap_content_total{
    padding: 30px 75px;
  }
  .surnamePopulation_wrap_content_total_title h3{
    font-size: 36px;
  }
  .surnamePopulation_wrap_content_total_title p{
    font-size: 14px;
  }
  .surnamePopulation_wrap_content_total_cai{
    margin: 18px 0 24px 0;
  }
  .surnamePopulation_wrap_content_total_cai h3{
    font-size: 30px;
  }
  .surnamePopulation_wrap_content_total_cai p{
    font-size: 14px;
  }
  .surnamePopulation_wrap_content_total_xuanze li{
    width: 45%;
    margin-bottom: 30px;
  }
  .surnamePopulation_wrap_content_total_xuanze img{
    margin-right: 12px;
    width: 60px;
    height: 60px;
  }
  .surnamePopulation_wrap_content_total_xuanze p{
    font-size: 30px;
  }
  .surnamePopulation_wrap_content_total_xuanze span{
    font-size: 14px;
  }
  .surnamePopulation_wrap_content_total_ji{
    margin: 54px 0 36px 0;
  }
  .surnamePopulation_wrap_content_total_ji h3{
    font-size: 30px;
  }
  .surnamePopulation_wrap_content_total_ji p{
    font-size: 90px;
  }
  .surnamePopulation_wrap_content_total_right{
    font-size: 18px;
    margin-top: 24px;
  }
  .surnamePopulation_wrap_content_surname_sort{
    padding: 24px;
    height: calc(100% - 58px);
  }
  .surnamePopulation_wrap_content_surname_sort li{
    font-size: 24px;
    height: 45px;
    line-height: 45px;
  }
  .surnamePopulation_wrap_content_surname_sort_t h3{
    font-size: 30px;
  }
  .surnamePopulation_wrap_content_surname_sort_t p{
    font-size: 14px;
  }
}
</style>
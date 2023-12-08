<template>
    <div class="celebrityProfile_wrap fontSize30 PingFang_Regular">
        <AdaiTitle :path="'/Celebrity?s='+surname+'&py='+pinyin" :title="'名人简介'" :theme="'theme'" :titleE="'Celebrity profile'" />
        <div class="celebrityProfile_people_wrap">
            <div class="swiper-container swiper-container-horizontal">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in celebrityList" :key="'people'+index">
                        <div class="swiper-slide-card" :id="index" :style="{backgroundImage:'url('+item.img+')'}">
                            <p class="swiper-slide-label fontSize26">{{item.name}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        </div>
        <div class="celebrityProfile_people_summary_wrap" v-html="celebrityProfile && (celebrityProfile.remark || celebrityProfile.memo)"></div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import AdaiTitle from "../components/adai/AdaiTitle.vue";
export default {
    name: "celebrityProfile",
    components: {
        AdaiTitle,
    },
    data: () => {
        return {
            pinyin:'',
            surname:'',
            id:'',
            profileIndex:0,
            swiper:'',
            startTime: 0,
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '',id=param['id'] || '';
        this.surname = surname;
        this.pinyin = pinyin;
        this.id = id;
        this.$store.dispatch('changePropertyValue',{property:'celebrityList',value:''});
        this.startTime = Date.now();
    },
    mounted:function(){
        this.getCelebrityList();
    },
    destroyed:function(){
      this.clickNum('姓氏名人', 'L1', Date.now() - this.startTime)
    },
    methods:{
        async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        init(){    
            let w=window.innerWidth,self = this,slidesPerView=7,loop= this.celebrityList.length >= slidesPerView ? true : false; 
            if(w >=1050 && w < 1366){
                slidesPerView = 5;
            }
            
            this.swiper = new Swiper('.swiper-container', {
                loop: loop,
                grabCursor : true,
                roundLengths : true,
                speed: 2500,
                slidesPerView: slidesPerView,
                // spaceBetween: -100,
                centeredSlides : true,
                watchSlidesProgress : true,
                initialSlide:self.profileIndex,
                slideToClickedSlide: true,//点击slide会过渡到这个slide
                // touchRatio : 0,//无法滑动
                // autoplay: true,
                on: {
                    setTranslate: function() {
                        for(var i=0; i< this.slides.length; i++){
                            var slide = this.slides.eq(i)
                            var progress = this.slides[i].progress
                            slide.css({'opacity': '','background': ''});
                            slide.transform('');//清除样式

                            slide.css({'z-index': progress === 0 ? 300 : 200/Math.abs(progress)});
                            slide.transform('scale('+(1 - Math.abs(progress)/8)+')');  
                            
                        }	
                    },
                    setTransition: function(transition) {
                        for (var i = 0; i < this.slides.length; i++) {
                            var slide = this.slides.eq(i)
                            slide.transition(transition);
                        }
                    },
                    touchEnd: function(event){
                        self.updatePage(this.realIndex);
                    },
                    slidePrevTransitionEnd: function(){
                        self.updatePage(this.realIndex);
                    },
                    slideNextTransitionEnd: function(){
                        self.updatePage(this.realIndex);
                    },
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        },
        updatePage(i){
            console.log(i);
            this.profileIndex = i;
            this.id = this.celebrityList[this.profileIndex]['_key'];
            this.getCelebrityProfile();
        },
        getCelebrityList(){
            this.$store.dispatch('getCelebrityList',{url:'https://home.qingtime.cn/surname/celebrity',body:{surname:this.surname,dynasty:'',industry:'',page:1,limit:1000}});
        },
        getCelebrityProfile(){
            this.$store.dispatch('getCelebrityProfile',{url:'https://home.qingtime.cn/surname/celebrity/detail',body:{cId:this.id}});
        },
        scrollIntoView(i){
            this.$nextTick( () => {
                document.getElementById('profile'+i).scrollIntoView({inline:'center'});            
            })
        },
    },
    computed: {
        ...mapState({
            celebrityProfile: state => state.surname.celebrityProfile,
            celebrityList:state => state.surname.celebrityList,
        })
    },
    watch:{
        'celebrityList':function(newV,oldV){
            if(newV && newV.length){
                this.profileIndex = newV.findIndex((currentValue,index,arr)=>{return currentValue._key == this.id});
                setTimeout(()=>{
                    this.init();
                },500);
            }
        },
    },
};
</script>
<style scoped lang="scss">
.celebrityProfile_wrap_wrap{
    width: 100%;
    min-height: 100%;
}
.celebrity_nav_wrap{
    display: flex;
    padding: 40px 0;
    justify-content: space-between;
    .celebrity_nav_title_box{
        margin-left: 62px;
        width: 50%;
        span{
            color: #666;
        }
    }
    img{
        width: 68px;
        height: 68px;
        cursor: pointer;
        margin-right: 20px;
    }
}
.celebrityProfile_ul_wrap{
    display: flex;
    color: #999;
    text-align: center;
    width: calc(100% - 4px);
    overflow-x: auto;
    padding: 2px;
    &.active{
        justify-content: center;
    }
    li{
        position: relative;
        margin-right: 10px;
        width: 306px;
        height: 456px;
        display: inline-block;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.40);
        &.active{
            box-shadow: 0 0 4px 0 var(--text-color);
            p{
                color: var(--text-color);
            }
        }
    }
    .modal{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,0.3);
    }
    .celebrityProfile_li_card{
        width: 290px;
        height: 380px;
        padding: 8px;
        background-color: #f1f1f1;
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
    }
    p{
        margin: 10px 0;
        color: #333;
    }
}
.celebrityProfile_people_wrap{
    position: relative;
    width: calc(100% - 252px);
    margin: 0 auto;
}
.celebrityProfile_people_summary_wrap{
    width: calc(100% - 252px);
    margin: 20px auto 0 auto;
    font-size: 2.8rem;
    color: #80807E;
    letter-spacing: 0;
    line-height: 46px;
    padding-bottom: 40px;
}
.swiper-container{
    width: 100%;
    padding: 20px 0;
    margin: auto;
    position: relative;
    overflow: hidden;
    list-style: none;
    z-index: 1;
}
.swiper-slide{
    position: relative;
    text-align: center;
    font-size: 18px;
    background-color: #f1f1f1;
    cursor: pointer;
    height: 380px;
    width: 240px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition-property: all;
    box-shadow: 0 0 1px 2px #ddd;
}
.swiper-slide-card{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-repeat: no-repeat;
    background-size: cover;
}
.swiper-slide-label{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    color: #333;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: rgba(255,255,255,0.9);
}
.swiper-slide-active{
  box-shadow: 0 0 1px 2px var(--text-color);
}
.swiper-slide-active .swiper-slide-label{
    // color: #000;
    color: var(--text-color);
}
.swiper-button-prev{
    left: -80px;
    color: var(--text-color);
    outline: none;
}
.swiper-button-next{
    right: -80px;
    outline: none;
    color: var(--text-color);
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .celebrityProfile_people_wrap{
        width:calc(100% - 150px);
    }
    .celebrityProfile_people_summary_wrap{
        width:calc(100% - 150px);
        font-size: 18px;
        padding-bottom: 24px;
        line-height: 30px;
    }
    .swiper-button-prev{
        left: -50px;
    }
    .swiper-button-next{
        right: -50px;
    }
}
</style>
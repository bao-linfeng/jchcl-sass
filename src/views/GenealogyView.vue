<template>
    <div class="GenealogyView_wrap">
        <div class="genealogyView_image_wrap" :class="{iphone:isiPhone,active:!isSlider}" @mousewheel="rollImg" @click="isSlider=!isSlider">
            <img id="jiapu_touch" :style="{transform:'scale('+scale+')'}" :src="imageURL || 'data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs='" alt="影像" />
            <!-- <div class="genealogyView_image_box" id="jiapu_touch"></div> -->
        </div>
        <div class="prev" :class="{active:page<=0,iphone:isiPhone}" @click="prevPage"><img :src="require('../assets/genealogy/left'+(page<=0 ? 'Active' : '')+'.svg')" alt=""></div>
        <div class="prev next" :class="{active:page>=genealogyViewTotal-1,iphone:isiPhone}" @click="nextPage"><img :src="require('../assets/genealogy/right'+(page>=genealogyViewTotal-1 ? 'Active' : '')+'.svg')" alt=""></div>
        <div class="sliderBox" :class="{iphone:isiPhone}" v-show="isSlider">
            <AdaiSlider v-if="genealogyViews.length" v-on:change-range="changeRange" :page="page" :min="1" :max="genealogyViewTotal-1" />
            <div class="sliderPageBox">
                <span class="marginLeft10 fontSize40 PingFangSC_Medium">{{page+1}}</span>
                <span class="total fontSize30 PingFang_Regular">/{{genealogyViewTotal}}</span>
            </div>
        </div>
        <div class="linkHand_wrap" @click="isShow=false" v-show="isShow"></div>
        <img class="close_btn" :class="{iphone: false}" src="../assets/close.svg" @click="goBack" alt="关闭" />
        <!-- <div class="tips-wrap" v-show="isTips" @click="isTips=false">
            <div class="tips-box">
                <h1>温馨提示</h1>
                <p>Warm Tips</p>
                <span>亲爱的读者，本平台只开放每套家谱的前100页，如您想继续查阅，请访问网站<a v-if="isiPhone" href='https://1jiapu.com' target="_blank">https://1jiapu.com</a><i v-else>家谱研究区</i>，免费查阅。</span>
            </div>
        </div> -->
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import AdaiSlider from "../components/adai/AdaiSlider.vue";
const cache = {};
export default {
    name: "GenealogyView",
    components: {
        AdaiSlider,
    },
    data: () => {
        return {
            pinyin:'',
            surname:'',
            id:'',
            name:'',
            menu:[],
            tabIndex:-1,
            isShow:false,
            page:0,
            flag:false,
            scale:1,
            isiPhone: true,
            isSlider: true,
            isTips:false,
            startTime: 0,
            imageURL: '',
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),n=param['n'] ? decodeURIComponent(param['n']) : '',surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '',id=param['id'] || '';
        this.surname = surname;
        this.pinyin = pinyin;
        this.id = id;
        this.name = n;
        this.menu = '首卷,家风家训,前言,刘氏家志序,刘氏各支系家谱原序,刘氏支系世系图,刘氏支系世表,刘氏先祖名人,刘氏宗祠,刘氏贡献榜'.split(',');
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            // this.isiPhone = true;
        }
        this.startTime = Date.now();
    },
    mounted:function(){
        this.getGenealogyView();
        this.initHammer();
    },
    destroyed:function(){
      this.clickNum('姓氏族谱', 'L1', Date.now() - this.startTime);
    },
    methods:{
        async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        loadImage(url){
            // console.log(url);
            // let img = new Image();
            // img.src = url;
            
            this.imageURL = url
        },
        initHammer(){
            const myElement = document.querySelector('#jiapu_touch');
            const hammertime = new Hammer(myElement);
            hammertime.get('pinch').set({ enable: true });
            hammertime.on('swipeleft swiperight pinchin pinchout', (ev) => {
                ev.type == 'swipeleft' ? this.nextPage() : null;
                ev.type == 'swiperight' ? this.prevPage() : null;
                ev.type == 'pinchin' ? this.setScale(-0.1) : null;
                ev.type == 'pinchout' ? this.setScale(0.1) : null;
            });
        },
        rollImg(event) {
            if(event.wheelDelta > 0){
                if(this.scale < 3){
                    this.scale=this.scale+0.1;
                }
            }else{
                if(this.scale > 0.2){
                    this.scale=this.scale-0.1;
                }
            }
        },
        setScale(i){
            if(this.scale > 0.2 && this.scale < 3){
                this.scale = this.scale + i;
            }
        },
        goBack(){
            history.go(-1);
        },
        changeRange(page){
            this.page = page;
            this.flag=true;
            console.log(page);
            this.getImageDetail(this.genealogyViews[this.page])
            // if(this.page > 1 || this.page < this.genealogyViewTotal-1){
            //     this.page < this.genealogyViewTotal-1 ? this.getImageDetail(this.genealogyViews[this.page]) : null;
            //     this.page  > 1 ?  this.getImageDetail(this.genealogyViews[this.page]): null;
            // }
        },
        nextPage(){
            if(this.page < this.genealogyViewTotal-1){
                this.flag=true;
                this.page=this.page+1;
                console.log('next',this.page);
                this.page < this.genealogyViewTotal-1 ? this.getImageDetail(this.genealogyViews[this.page]) : null;
            }else{
                this.isTips = true;
                // ADS.message('最后一页了');
            }
        },
        prevPage(){
            if(this.page > 0){
                this.flag=true;
                this.page=this.page-1;
                console.log('prev',this.page);
                this.getImageDetail(this.genealogyViews[this.page]);
            }else{
                ADS.message('第一页了');
            }
        },
        changeMenu(i){
            this.tabIndex = i;
        },
        getGenealogyView(){// https://gtdata.qingtime.cn/catalogImageList
            this.$store.dispatch('getGenealogyView',{url:'https://pumudata.qingtime.cn/fdc/imageList', body:{
                gcKey: this.id,
                pageNum: this.pageNum,
            }});
        },
        async getImageDetail(imageKey){
            let base64 = '';
            if(cache[imageKey]){
                base64 = cache[imageKey];
            }else{
                let result = await ADS.AdaiXHR('https://pumudata.qingtime.cn/fdc/imageDetail',{imageKey: imageKey},'GET',true);
                cache[imageKey] = base64 = result.result;
            }
            this.loadImage(base64);
        }
    },
    computed: {
        ...mapState({
            genealogyViews: state => state.surname.genealogyViews,
            genealogyViewTotal: state => state.surname.genealogyViewTotal,
            pageNum: state => state.surname.pageNum,
        })
    },
    watch:{
        'genealogyViews':function(newV,oldV){
            if(newV && newV.length){
                this.getImageDetail(newV[this.page]);
            }
        },
    },
};
</script>
<style scoped lang="scss">
.GenealogyView_wrap{
    position: relative;
    width: 100%;
    height: 100%;
    background: #666;
    display: flex;
}
.genealogyView_image_wrap{
    position: relative;
    // width: calc(100% - 430px);
    width: 100%;
    height: calc(100% - 80px);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    img{
        max-height: 100%;
        max-width: 100%;
        -webkit-user-drag: none;
    }
    .genealogyView_image_box{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        cursor: pointer;
    }
}
.genealogyView_menu_wrap{
    width: 430px;
    background: #fff;
    .genealogyView_nav_wrap{
        position: relative;
        padding: 30px 35px;
        border-bottom: 1px dashed #999;
        p{
            color: #666;
        }
        img{
            position: absolute;
            top: 30px;
            right: 35px;
            width: 80px;
            height: 80px;
        }
    }
    .genealogyView_menu_box{
        height: calc(100% - 221px);
        display: block;
        padding: 30px 35px;
        color: #999;
        overflow-y: auto;
        li{
            height: 66px;
            line-height: 66px;
            cursor: pointer;
            &.active{
                color: #5CB483;
            }
        }
    }
}
.sliderBox{
    position: fixed;
    left: 0;
    bottom: 0;
    // width: calc(100% - 430px);
    width: calc(100% - 86px);
    padding-left: 86px;
    height: 80px;
    display: flex;
    align-items: center;
    background: #484848;
    box-shadow: 0 -2px 4px 0 rgba(0,0,0,0.50);
    .sliderPageBox{
        width: 240px;
        color: #5CB483;
        display: flex;
        align-items: center;
        .marginLeft10{
            margin-left: 10px;
        }
        .total{
            color: #B8B8B8;
        }
    }
}
.linkHand_wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.4) url('../assets/genealogy/hand.svg') 50% 50% no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    text-align: center;
    cursor: pointer;
}
.close_btn{
    position: fixed;
    top: 40px;
    right: 40px;
    z-index: 10;
    cursor: pointer;
}
.prev{
    position: absolute;
    top: 50%;
    left: 40px;
    transform: translateY(-50%);
    width: 88px;
    height: 88px;
    border-radius: 50%;
    // background: gray;
    cursor: pointer;
    img{
        width: 100%;
        height: 100%;
    }
    &.active{
        -webkit-filter: grayscale(100%); 
        -moz-filter: grayscale(100%); 
        -ms-filter: grayscale(100%); 
        -o-filter: grayscale(100%); 
        filter: grayscale(100%); 
        filter: gray;  
        cursor: wait;
    }
}
.next{
    left: auto;
    right: 40px;
}
.tips-wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #333;
    z-index: 10000;
    .tips-box{
        background-color: #fff;
        padding: 20px 100px;
        border-radius: 5px;
        width: 700px;
        height: 560px;
        h1{
            font-size: 68px;
            margin-top: 56px;
        }
        p{
            font-size: 26px;
            color: #999;
        }
        span{
            margin-top: 48px;
            line-height: 60px;
            font-size: 34px;
            display: block;
            i{
                color: #333;
            }
            a{
                color: #333;
                cursor: pointer;
            }
        }
        .ewm{
            width: 150px;
        }
    }
}
@media screen and (max-width: 1920px) and (min-width: 501px) {
    .genealogyView_image_wrap{
        &.iphone{
            height: calc(100% - 40px);
        }
        &.active{
            height: 100%;
        }
    }
    .close_btn{
        &.iphone{
            width: 60px;
            height: 60px;
            top: 20px;
            right: 20px;
            display: none;
        }
    }
    .prev{
        &.iphone{
            width: 60px;
            height: 60px;
            left: 20px;
        }
    }
    .next{
        &.iphone{
            left: auto;
            right: 20px;
        }
    }
    .sliderBox{
        width: calc(100% - 10px);
        padding-left: 10px;
        &.iphone{
            height: 40px;
        }
        .sliderPageBox{
            width: 120px;
            span{
                font-size: 20px;
                &.total{
                    font-size: 16px;
                }
            }
        }
    }
}
@media screen and (max-width:500px) {
    .close_btn{
        width: 40px;
        height: 40px;
        top: 20px;
        right: 20px;
        display: none;
    }
    .prev{
        width: 40px;
        height: 40px;
        left: 10px;
    }
    .next{
        left: auto;
        right: 10px;
    }
    .sliderBox{
        height: 60px;
        width: calc(100% - 10px);
        padding-left: 10px;
        .sliderPageBox{
            width: 120px;
            span{
                font-size: 20px;
                &.total{
                    font-size: 16px;
                }
            }
        }
    }
    .tips-wrap{
        .tips-box{
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            width: 340px;
            height: 280px;
            h1{
                font-size: 24px;
                margin-top: 36px;
            }
            p{
                font-size: 18px;
                color: #999;
            }
            span{
                margin-top: 38px;
                font-size: 20px;
                display: block;
                i{
                    color: #333;
                }
                a{
                    color: #333;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>


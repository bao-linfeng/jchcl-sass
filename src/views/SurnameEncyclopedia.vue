<template>
    <div class="surnameEncyclopedia_wrap">
        <AdaiTitle :theme="'theme'" :path="'/SurnameExplorer?s='+surname+'&py='+pinyin" :title="'姓氏百科'" :titleE="'Surname Encyclopedia'" />
        <ul class="surnameEncyclopedia_wrap_surname_nav fontSize26 PingFangSC_Medium">
            <li v-for="(item,index) in surnameNav" :key="'surnameNav'+index" :class="{active:surnameIndex===index}" @click="changeSurnameIndex(index)" v-show="item.show">
                <div>
                    <img v-show="surnameIndex==index" :src="require('../assets/surnameEncyclopedia/'+index+'.svg')" alt="" />
                    <p>{{item.n}}</p>
                </div>
            </li>
        </ul>
        <div class="surnameEncyclopedia_wrap_content">
            <div class="surnameEncyclopedia_wrap_content_title">
                <div class="surnameEncyclopedia_wrap_content_title_surname" v-for="(item,index) in surname" :key="'surname'+index">
                    <div class="KaiTi">{{item}}</div>
                </div>
                <div v-if="surO[surname]" class="surnameEncyclopedia_wrap_content_title_surname marginL10">
                    <div class="KaiTi">{{surO[surname]}}</div>
                </div>
                <!-- <img class="laba" @click="toggleTTS" :src="require('../assets/surnameEncyclopedia/laba'+(isTTS === 1 ? 'Close' : '')+'.svg')" alt="" /> -->
            </div>
            <div class="surnameEncyclopedia_wrap_content_detail fontSize28 PingFang_Regular style1" id="surnameEncyclopedia_wrap_content_detail">
                <!-- !isShow -->
                <div v-show="surnameIndex == 1 && surSummary">
                    <div class="summary" v-html="surSummary"></div>
                    <span class="more" v-show="!isShow" @click="isShow = true">显示更多</span>
                </div>
                <div v-show="(surSummary ? surnameIndex == 1 && isShow : true) || surnameIndex != 1" v-html="(surnameDetail[surnameObj[surnameIndex]])"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import AdaiTitle from "../components/adai/AdaiTitle.vue";
export default {
    name: "surnameEncyclopedia",
    components: {
        AdaiTitle,
    },
    data: () => {
        return {
            pinyin:'',
            surname:'',
            surnameIndex:0,
            surnameNav:[{n:'姓氏用字',show:true},{n:'姓氏渊源',show:true},{n:'各支始祖',show:true},{n:'迁徙分布',show:true},{n:'郡望堂号',show:true},{n:'家谱文献',show:true},{n:'字辈排行',show:true},{n:'楹联典故',show:true}],
            surnameObj:{
                "0": "xsyz",
                "1": "xsyy",
                "2": "gzsz",
                "3": "qxfb",
                "4": "jwth",
                "5": "jpwx",
                "6": "zbph",
                "7": "yldg"
            },
            isTTS:-1,
            startTime: 0,
            endTime: 0,
            isShow: false,
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname;
        this.pinyin = pinyin;
        this.startTime = Date.now();
        this.endTime = Date.now();
    },
    mounted:function(){
        this.getSurnameDetail();
    },
    destroyed:function(){
        window.synth ? window.speechSynthesis.cancel() : null;
        this.clickNum('姓氏百科', 'L1', Date.now() - this.startTime)
    },
    methods:{
        async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        toggleTTS(){
            switch(this.isTTS){
                case 0:
                    window.speechSynthesis.pause();
                    break;
                case 1:
                    window.speechSynthesis.resume();
                    break;
                default:
                    this.TTS((this.surnameDetail[this.surnameObj[this.surnameIndex]]).replace(/<\/?.+?>/g,""));
                    break;
            }
        },
        TTS(data){
            window.synth ? window.speechSynthesis.cancel() : window.synth = new window.SpeechSynthesisUtterance();
            window.synth.text = data.toString().replace(/[\&nbsp\;,：]/g,''); 
            // console.log(data.toString().replace(/[\&nbsp\;,：(]/g,''));
            window.speechSynthesis.speak(window.synth);
            window.synth.onstart = () => {
                console.log('tts is start');
                this.isTTS = 0;
            }
            window.synth.onpause = () => {
                console.log('tts is pause');
                this.isTTS = 1;
            }
            window.synth.onresume = () => {
                console.log('tts is resume');
                this.isTTS = 0;
            }
            window.synth.onend = () => {
                console.log('tts is end');
                this.isTTS = -1;
            }
        },
        changeSurnameIndex(i){
            this.surnameIndex = i;
            document.querySelector('#surnameEncyclopedia_wrap_content_detail').scrollTop = 0;
            this.isTTS = -1;
            window.synth ? window.speechSynthesis.cancel() : null;
            // this.TTS((this.surnameDetail[this.surnameObj[i]]).replace(/<\/?.+?>/g,""));
        },
        getSurnameDetail(){
            this.$store.dispatch('getSurnameDetail',{url:'https://home.qingtime.cn/surname/surname/chunk',body:{surname:this.surname}});
        },
    },
    computed: {
        ...mapState({
            surnameDetail: state => state.surname.surnameDetail,
            surSummary: state => state.surname.surSummary,
            surO: state => state.surname.surO,
        })
    },
    watch:{
        surnameDetail:function(newV,oldV){
            if(newV){
                let surnameIndex = this.surnameIndex;
                this.surnameNav.map((item,index)=>{
                    if(newV[this.surnameObj[index]]){
                        if((newV[this.surnameObj[index]].indexOf('资料有待补充') <= 300 && newV[this.surnameObj[index]].indexOf('资料有待补充') >= 0)){
                            item.show = false;
                        }
                    }else{
                        item.show = false;
                    }
                    !surnameIndex && item.show ? surnameIndex = index+'' : null;
                })
                this.surnameIndex = Number(surnameIndex);
                // this.TTS((this.surnameDetail[this.surnameObj[this.surnameIndex]]).replace(/<\/?.+?>/g,""));
                // this.surnameIndex = this.surnameNav.findIndex((value,index,arr)=>{return value.show});
            }
        },
        surnameIndex:function(nv, ov){
            this.clickNum(this.surnameNav[nv].n, 'L2', '');
            this.clickNum(this.surnameNav[ov].n, 'L2', Date.now() - this.endTime);
            this.endTime = Date.now();
        },
    },
};
</script>
<style>
.surnameEncyclopedia_wrap{
    width: 100%;
    height: 100%;
    background: url('../assets/surnameEncyclopedia/bg.png') 50% 50% no-repeat;
    background: cover;
}
.surnameEncyclopedia_wrap_surname_nav{
    position: absolute;
    top: -65px;
    right: 108px;
    display: flex;
    color: #4D4D4A;
    text-align: center;
}
.surnameEncyclopedia_wrap_surname_nav li{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 175px;
    border-radius: 65px;
    padding-top: 65px;
    cursor: pointer;
    margin-left: 20px;
}
.surnameEncyclopedia_wrap_surname_nav li:only-child{
    line-height: 240px;
}
.surnameEncyclopedia_wrap_surname_nav img{
    margin: 0 auto 10px auto;
    display: block;
}
.surnameEncyclopedia_wrap_surname_nav li.active{
    background: #5CB483;
    color: #fff;
}
.surnameEncyclopedia_wrap_content{
    position: relative;
    width: calc(100% - 266px);
    height: calc(100% - 243px);
    margin: 30px 108px 0 108px;
    padding: 60px 30px 0 30px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #DFDFDF;
    box-shadow: 0 3px 9px 8px rgba(74,74,74,0.05);
}
.surnameEncyclopedia_wrap_content_title{
    position: relative;
    display: flex;
    align-items: center;
    font-size: 88px;
    color: #333;
    padding-bottom: 20px;
    border-bottom: 1px solid #dfdfdf;
}
.surnameEncyclopedia_wrap_content_title_surname{
    display: flex;
    align-items: flex-end;
}
.surnameEncyclopedia_wrap_content_title_surname:nth-of-type(1){
    margin-left: 30px;
}
.surnameEncyclopedia_wrap_content_title_surname div{
    width: 100px;
    height: 100px;
    line-height: 90px;
    text-align: center;
    background: url('../assets/surnameEncyclopedia/tian.svg') 50% 50% no-repeat;
}
.surnameEncyclopedia_wrap_content_title p{
    color: #999;
    margin: 0 20px;
}
.surnameEncyclopedia_wrap_content_title span{
    color: #4D4D4A;
}
.laba{
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin-left: 20px;
}
.surnameEncyclopedia_wrap_content_detail{
    padding: 30px;
    height: calc(100% - 181px);
    overflow-y: auto;
    color: #80807E;
}
.surnameEncyclopedia_wrap_content_detail img{
    display: block;
    margin: 0 auto;
}
.surnameEncyclopedia_wrap_content_detail:empty::before{
    content: '暂无数据';
    display: block;
    line-height: 400px;
    text-align: center;
}
.summary{
    color: #000;
    margin-bottom: 30px;
    font-family: 'Arial';
    font-size: 30px;
}
.more{
    display: block;
    width: 200px;
    height: 50px;
    line-height: 50px;
    border-radius: 25px;
    border: 1px solid #ddd;
    cursor: pointer;
    margin: 50px auto 20px auto;
    text-align: center;
}
.more:hover{
    background: #5CB483;
    color: #fff;
    border-color: #5CB483;
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .surnameEncyclopedia_wrap_surname_nav{
        right: 60px;
        top: -38px;
        font-size: 14px;
    }
    .surnameEncyclopedia_wrap_surname_nav li{
        width: 80px;
        height: 100px;
        border-radius: 40px;
        margin-left: 12px;
        padding-top: 40px;
    }
    .surnameEncyclopedia_wrap_surname_nav img{
        margin-bottom: 2px;
    }
    .surnameEncyclopedia_wrap_content{
        width: calc(100% - 156px);
        height: calc(100% - 186px);
        padding: 18px;
        margin: 0 60px;
    }
    .surnameEncyclopedia_wrap_content_title{
        padding-bottom: 18px;
    }
    .surnameEncyclopedia_wrap_content_detail{
        padding: 18px;
        height: calc(100% - 156px);
        font-size: 18px;
    }
    .surnameEncyclopedia_wrap_content_title_surname:nth-of-type(1){
        margin-left: 18px;
    }
}
.marginL10{
    margin-left: 10px;
}
</style>
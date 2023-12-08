<template>
    <div class="perspective_3d selectSurname_bg fontSize38 PingFang_Regular">
        <div class="selectSurname_wrap" :class="{animate_rotate_resive:isAnimate_rotate_resive}">
            <AdaiTitle :path="'/'" />
            <div class="selectSurname_wrap_content">
                <div class="selectSurname_wrap_content_char style1">
                    <i class="fontSize26" :class="{active:isAll}" @click="changeAll">常用姓氏</i>
                    <i class="selectSurname_wrap_content_char_hand" @click="changeHand" :class="{active:isHand}"><img :src="require('../assets/selectSurname/hand'+(isHand ? '_active' : '')+'.svg')" alt="手写" /></i>
                    <span :class="{active:char == item}" v-for="(item,index) in chars" :key="'char'+index" @click="changeChar(item)">{{item}}</span>
                </div>
                <div class="selectSurname_wrap_content_hand_surname hs" :class="{selectSurname_wrap_content_hand_surname_active:isHand}" v-show="isHand">
                    <div class="selectSurname_wrap_content_hand_surname_wrapbox">
                        <div class="selectSurname_wrap_content_hand_surname_search">
                            <input class="fontSize38" type="text" v-model="surname" />
                            <img v-show="surname.length >= 2" class="selectSurname_wrap_content_hand_surname_search_backspace" src="../assets/surnameExplorer/backspace.svg" alt="" @click="clearSurname"  />
                            <img v-show="surname.length >= 1" class="selectSurname_wrap_content_hand_surname_search_delete" src="../assets/surnameExplorer/delete.svg" alt="关闭" @click="deleteSurname" />
                        </div>
                        <div class="selectSurname_wrap_content_hand_surname_wrap style1">
                            <span :class="{active:surname==item}" v-for="(item,index) in surnameLess" :key="'surnameLess'+index" @click="changeHandSurname(item)">{{item}}</span>
                        </div>
                    </div>
                    <div class="selectSurname_wrap_content_hand_surname_tool"><iframe id="ink_paper_iframe" :src="handURL" frameborder="0"></iframe></div>
                </div>
                <div class="selectSurname_wrap_content_char_surname style1" v-show="!isHand">
                    <div class="selectSurname_wrap_content_char_surname_box style1" id="selectSurname_wrap_content_char_surname_box">
                        <span :class="{active:surname==item.hz}" :style="{width:((item.hz.length+(item.same ? item.same.length+1 : 0)) >=4 ? (3*73+16) : ((item.hz.length+(item.same ? item.same.length+1 : 0)) >=2 ? (2*73+8): (item.hz.length+(item.same ? item.same.length+1 : 0))*73))+'px'}" @click="changeSurname(item)" v-for="(item,index) in surnames" :key="'surname'+index">{{item.same ? item.same+'/' : ''}}{{item.hz}}<i class="fontSize16 MuseoSlab300">{{item.py}}</i></span>
                    </div>
                </div>
                <!-- <img v-show="isHand" @click="closeHand" class="handHide" src="../assets/surnameExplorer/hide.svg" alt="手写板隐藏" /> -->
            </div>
            <div class="selectSurname_wrap_foot">
                <button class="a_button fontSize48 PingFangSC_Medium" :class="{active:!surname}" @click="goto">开始探索</button>
            </div>
        </div>
        <div class="warning_msg fontSize30" v-show="isShowMSG">数据库暂无该姓氏</div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import surname from "../utils/surname.js";
import AdaiTitle from "../components/adai/AdaiTitle.vue";
export default {
    name: "selectSurname",
    components: {
        AdaiTitle,
    },
    data: () => {
        return {
            isAll: true,
            isHand: false,
            handURL: 'https://handwrite.qingtime.cn',
            chars:['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','W','X','Y','Z'],
            char:'',
            surname:'',
            pinyin:'',
            surnameLess:[],
            paper:'',
            oneClick:true,
            origin:'',
            paper:'',
            ink_paper_iframe:'',
            isAnimate_rotate_resive:false,
            isShowMSG:false,
            timer:'',
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname;
        this.pinyin = pinyin;
        this.origin = window.location.origin;
    },
    mounted:function(){
        this.ink_paper_iframe = document.querySelector('#ink_paper_iframe');
        this.getSurnameSort();
        window.addEventListener("message", (e) => {
            switch (e.data.eventName) {
                case "get-surnames": {
                    this.surnameLess = e.data.data;
                    break;
                }
            }
        });
    },
    methods:{
        closeHand(){
            this.isHand = false;
            this.isAll = true;
            this.getSurnameSort();
        },
        changeHandSurname(item){
            this.surname = this.surname + item;
            this.pinyin = '';
            this.surnameLess = [];
            this.ink_paper_iframe.contentWindow.postMessage({ eventName: "clear-paper", data: ''}, "*");
        },
        getSurnameSort(){
            this.$store.dispatch('getSurnameSort',{url:'https://home.qingtime.cn/surname/surname/sort',body:{page:1,limit:300}});
        },
        async clickNum(){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/clickNum',{'surname': this.surname},'POST',true);
        },
        goto(){
            if(this.hasSurname){
                if(!this.isShowMSG){
                    this.isShowMSG = true;
                    this.timer = setTimeout(()=>{this.isShowMSG = false;},3000);
                }
                
                // ADS.message('数据库暂无该姓氏');
                return false;
            }
            if(this.surname){
                this.clickNum();
                this.$router.push('/SurnameExplorer?s='+this.surname+'&py='+this.pinyin);
            }
            // this.isAnimate_rotate_resive = true;
            // this.surname ? setTimeout(()=>{this.$router.push('/SurnameExplorer?s='+this.surname+'&py='+this.pinyin)},1500) : null;
        },
        changeAll(){
            this.isAll = !this.isAll;
            this.char ? this.char = '' : null;
            this.surname ? this.surname = '' : null;
            this.isHand ? this.isHand = false : null;
            this.getSurnameSort();
        },
        changeHand(){
            this.isHand = !this.isHand;
            this.char ? this.char = '' : null;
            this.surname ? this.surname = '' : null;
            this.isAll ? this.isAll = false : null;
            this.pinyin = '';
        },
        changeChar(item){
            this.char = item;
            this.surname ? this.surname = '' : null;
            this.isHand ? this.isHand = false : null;
            this.isAll ? this.isAll = false : null;
            document.querySelector('#selectSurname_wrap_content_char_surname_box').scrollTop = 0;
            this.getSurnameList();
        },
        changeSurname(item){
            this.surname == item.hz ? this.surname = '' : this.surname = item.hz;
            this.pinyin == item.py ? this.pinyin = '' : this.pinyin = item.py;
        },
        getSurnameList(){
            this.$store.dispatch('getSurnameList',{url:'https://home.qingtime.cn/surname/surname',body:{alpha:this.char.toLowerCase(),needPinYin:1}});
        },
        clearSurname(){
            this.surname = this.surname.substr(0,this.surname.length-1);
            this.surnameLess = [];
            // this.ink_paper_iframe.contentWindow.postMessage({ eventName: "clear-paper", data: ''}, "*");
        },
        deleteSurname(){
            this.surname = '';
            this.surnameLess = [];
            // this.ink_paper_iframe.contentWindow.postMessage({ eventName: "clear-paper", data: ''}, "*");
        },
    },
    computed: {
        hasSurname:function(){
            return this.isHand && surname.surnames.indexOf(this.surname) == -1;
        },
        ...mapState({
            surnames: state => state.surname.surnames,
            surnameSortList: state => state.surname.surnameSortList,
        })
    },
};
</script>
<style>
.selectSurname_bg{
    position: relative;
    width: 100%;
    height: 100%;
    background: url('../assets/surnameExplorer/bg0.jpg') 50% 50% no-repeat;
    background-size: cover;
}
.selectSurname_wrap{
    position: relative;
    width: 100%;
    height: 100%;
    background: url('../assets/selectSurname/bg0.png') 50% 50% no-repeat;
    background-size: cover;
}
.selectSurname_wrap_content{
    position: relative;
    width: calc(100% - 250px);
    height: calc(100% - 341px);
    margin: 0 auto;
    text-align: center;
    display: flex;
}
.handHide{
    position: absolute;
    top: 50%;
    left: -125px;
    transform: translateY(-50%);
    cursor: pointer;
}
.selectSurname_wrap_content_char{
    width: 304px;
    margin-right: 56px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
}
.selectSurname_wrap_content_char span{
    position: relative;
    display: inline-block;
    width: 90px;
    height: 68px;
    line-height: 68px;
    align-items: center;
    border-radius: 44px;
    background: #EFF0F0;
    color: #999;
    margin: 0 15px 14px 0;
    cursor: pointer;
}
.selectSurname_wrap_content_char span.active{
    background: #5CB483;
    color: #fff;
}
.selectSurname_wrap_content_char i{
    position: relative;
    display: inline-block;
    width: 135px;
    height: 68px;
    line-height: 68px;
    align-items: center;
    border-radius: 44px;
    background: #EFF0F0;
    color: #999;
    margin: 0 30px 14px 0;
    cursor: pointer;
    font-style: normal;
}
.selectSurname_wrap_content_char i.active{
    background: #5CB483;
    color: #fff;
}
.selectSurname_wrap_content_char i:nth-of-type(2){
    margin-right: 0;
}
.selectSurname_wrap_content_char span:nth-of-type(3n){
    margin-right: 0;
}
.selectSurname_wrap_content_char span.selectSurname_wrap_content_char_hand.active{
    background: #5CB483;
}
.selectSurname_wrap_content_char img{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.selectSurname_wrap_content_char_surname{
    position: relative;
    width: calc(100% - 360px);
    /* border: 3px solid #fff; */
    background: #fff;
    padding: 45px 0;
    text-align: left;
    overflow: hidden;
    /* overflow-y: auto;
    overflow-x: hidden; */
    z-index: 1;
    border-radius: 4px;
}
.selectSurname_wrap_content_char_surname_box{
    width: calc(100% - 90px);
    padding: 0 45px;
    height: 100%;
    overflow-y: auto;
    display: inline-flex;
    flex-wrap: wrap;
    align-content: flex-start;
}
.selectSurname_wrap_content_char_surname::before{
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    filter: blur(20px);
    z-index: -1;
    margin: -30px;
    background-color: rgba(255,255,255,0.9);
    background-image: url('../assets/selectSurname/bg.jpg');
    background-size: cover;
    background-attachment: fixed;
    
}
.selectSurname_wrap_content_char_surname::after{
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    background: rgba(255, 255, 255, 0.8);
    z-index: -1;
}
.selectSurname_wrap_content_char_surname span{
    display: inline-block;
    padding: 10px 0;
    height: 80px;
    width: 95px;
    color: #999;
    margin: 0 8px 8px 0;
    background: #fff;
    cursor: pointer;
    text-align: center;
    border-radius: 4px;
}
.selectSurname_wrap_content_char_surname span.active{
    background: #5CB483;
    color: #fff;
}
.selectSurname_wrap_content_char_surname i{
    font-style: normal;
    display: block;
    color: #999;
}
.selectSurname_wrap_content_char_surname span.active i{
    background: #5CB483;
    color: #fff;
}
.selectSurname_wrap_content_hand_surname{
    position: relative;
    width: calc(100% - 420px);
    background: #fff;
    padding: 30px;
    color: #999;
    display: flex;
    z-index: 1;
    overflow: hidden;
}
.selectSurname_wrap_content_hand_surname_active{
    /* width: 100%; */
}
.selectSurname_wrap_content_hand_surname::before{
    background-color: rgba(255,255,255,0.9);
    background-image: url('../assets/selectSurname/bg.jpg');
    background-size: cover;
    background-attachment: fixed;
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    filter: blur(20px);
    z-index: -1;
    margin: -30px;
}
.selectSurname_wrap_content_hand_surname::after{
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    background: rgba(255, 255, 255, 0.8);
    z-index: -1;
}
.selectSurname_wrap_content_hand_surname_search{
    position: relative;
    height: 70px;
    line-height: 70px;
    background: #fff;
    display: flex;
    border: 0 solid #D1D1D1;
    /* margin-top: 6px; */
    width: 390px;
}
.selectSurname_wrap_content_hand_surname_search input{
    width: 100%;
    height: 100%;
    border: none;
    text-indent: 20px;
    outline: none;
    color: #999;
}
.selectSurname_wrap_content_hand_surname_search_delete{
    position: absolute;
    top: 10px;
    right: 10px;
    height: 50px; 
    cursor: pointer;
}
.selectSurname_wrap_content_hand_surname_search_backspace{
    position: absolute;
    top: 10px;
    right: 70px;
    height: 50px; 
    cursor: pointer;
}
.selectSurname_wrap_content_hand_surname_less{
    margin-bottom: 24px;
    text-align: left;
    margin: 20px 0;
}
.selectSurname_wrap_content_hand_surname_less span{
    display: inline-block;
    margin-right: 15px;
    cursor: pointer;
}
.selectSurname_wrap_content_hand_surname_wrapbox{
    height: calc(100% - 80px);
    width: 400px;
    /* display: flex; */
}
.selectSurname_wrap_content_hand_surname_wrap{
    margin-top: 10px;
    width: 400px;
    overflow-y: auto;
    text-align: left;
}
.selectSurname_wrap_content_hand_surname_wrap span{
    display: inline-block;
    /* padding: 10px 15px; */
    width: 70px;
    height: 70px;
    line-height: 70px;
    color: #999;
    margin: 0 10px 10px 0;
    background: #fff;
    cursor: pointer;
    text-align: center;
}
.selectSurname_wrap_content_hand_surname_wrap span.active{
    background: #5CB483;
    color: #fff;
}
.selectSurname_wrap_content_hand_surname_tool{
    width: calc(100% - 379px);
    height: 100%;
    border-left: 1px dashed #C2C2C2;
    margin-left: 20px;
    /* height: calc(100% - 164px); */
}
#ink_paper_iframe{
    width: 100%;
    height: 100%;
}
.selectSurname_wrap_foot{
    width: calc(100% - 250px);
    margin: 30px auto;
    text-align: right;
}
#ink_paper{position:relative; width: 100%;height: 100%;}
#ink_paper::before{content:""; position:absolute; border-left:1px dashed #fff; width:1px; height:80%; left: 50%; top:10%;}
#ink_paper::after{content:""; position:absolute; border-top:1px dashed #fff; width:80%; height:1px; left: 10%; top:50%;}
.warning_msg{
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 350px;
    height: 110px;
    line-height: 110px;
    border-radius: 10px;
    background: rgba(255,255,255,0.9);
    z-index: 10000;
    text-align: center;
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .selectSurname_wrap_content{
        width: calc(100% - 150px);
        height: calc(100% - 218px);
    }
    .selectSurname_wrap_foot{
        width: calc(100% - 150px);
        margin: 18px auto;
    }
}
</style>
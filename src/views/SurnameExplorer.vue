<template>
    <div class="perspective_3d surnameExplorer_bg">
        <div class="surnameExplorer_wrap" :class="{animate_rotate:iSanimate_rotate}">
            <div class="surnameExplorer-carousel-box">
                <AdaiCarousel :imgs="[1,2]" />
            </div>
            <div class="adai_title_wrap">
                <img @click.stop="goBack" :src="require('../assets/surnameExplorer/toggle.svg')" alt="返回" />
                <div class="adai_title_box">
                    <p class="fontSize48 PingFangSC_Medium">姓氏探索</p>
                    <!-- <span class="fontSize26 MuseoSlab300">Surname Explorer</span> -->
                </div>
            </div>
            <div class="surnameExplorer_wrap_content">
                <ul class="surnameExplorer_wrap_content_surname">
                    <li v-for="(item,index) in surname" :key="'surname'+index">
                        <div>{{item}}</div>
                        <span class="MuseoSlab300">{{pinyin ? pinyin.split(' ')[index] : ''}}</span>
                    </li>
                    <li v-if="surO[surname]">
                        <div>{{surO[surname]}}</div>
                        <span class="MuseoSlab300">{{pinyin}}</span>
                    </li>
                </ul>
                <!-- <router-link class="surnameExplorer_wrap_content_toggle h" :to="'/About?s='+surname+'&py='+pinyin">关于FamilySearch</router-link> -->
            </div>
            <ul class="surnameExplorer_wrap_foot PingFang_Regular">
                <li v-for="(item,index) in entry" :key="'entry'+index" :class="{active:!item.show}" @click="goto(item,index)">
                    <div class="surnameExplorer_wrap_foot_img">
                        <img :src="require('../assets/surnameExplorer/'+index+'.svg')" alt="" />
                        <p class="fontSize20" v-show="item.msg">暂无数据</p>
                    </div>
                    <h3 class="fontSize38">{{item.t}}</h3>
                    <p class="fontSize20">{{item.desc}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import AdaiCarousel from "../components/adai/AdaiCarousel.vue";
export default {
    name: "surnameExplorer",
    components: {
        AdaiCarousel,
    },
    data: () => {
        return {
            iSanimate_rotate:false,
            pinyin:'',
            surname:'',
            entryObj:{0:'hasBaiKe',1:'hasPop',2:'hasDistr',3:'hasCele',4:'hasCata',5:'hasRule'},
            entry:[
                {t:'姓氏百科',desc:'解读家族世系传承的编码，赐姓命氏溯渊源。',path:'/SurnameEncyclopedia',show: 1,msg:false},
                {t:'姓氏人口',desc:'猜猜看，现今有多少人与你同姓？',path:'/SurnamePopulation',show: 1,msg:false},
                {t:'后裔分布',desc:'后裔子孙遍布全国各地，原来我身边有这么多的你。',path:'/ProgenyDistribution',show: 1,msg:false},
                {t:'姓氏名人',desc:'薪火传承，代代人才出，你们是我们家族的骄傲。',path:'/Celebrity',show: 1,msg:false},
                {t:'姓氏族谱',desc:'不为人知的家族历史传承，由你来诉说。',path:'/GenealogyCollection',show: 1,msg:false},
                {t:'家风家训',desc:'祖辈们的谆谆教诲，引领子孙持家立业。',path:'/FamilyDiscipline',show: 1,msg:false}
            ],
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname;
        this.pinyin = pinyin;
        this.checkData();
        this.pinyin ? null : this.getPinYin();
    },
    mounted:function(){
        if(this.province){
            this.entry = [
                {t:'姓氏百科',desc:'解读家族世系传承的编码，赐姓命氏溯渊源。',path:'/SurnameEncyclopedia',show: 1,msg:false},
                {t:'姓氏人口',desc:'猜猜看，现今有多少人与你同姓？',path:'/SurnamePopulation',show: 1,msg:false},
                {t:'后裔分布',desc:'后裔子孙遍布全国各地，原来我身边有这么多的你。',path:'/ProgenyDistribution',show: 1,msg:false},
                {t:'姓氏名人',desc:'薪火传承，代代人才出，你们是我们家族的骄傲。',path:'/Celebrity',show: 1,msg:false},
                {t: '姓氏族谱', desc: '不为人知的家族历史传承，由你来诉说。', path: '/CatalogSearch', show: 1, msg: false},
                {t:'家风家训',desc:'祖辈们的谆谆教诲，引领子孙持家立业。',path:'/FamilyDiscipline',show: 1,msg:false}
            ];
        }
    },
    methods:{
        async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        goto(item,i){
            if(this.checkDatas[this.entryObj[i]] == 1){
                this.clickNum(item.t, 'L1', '');
                this.$router.push(item.path+'?s='+(this.surOS[this.surname] ? this.surOS[this.surname] : this.surname)+'&py='+this.pinyin);
            }else{
                this.entry.map((item,index)=>{
                    if(i == index){
                        item['msg'] = true;
                        setTimeout(()=>{item['msg'] = false;},5000);
                    }
                });
            }
        },
        goBack(){
            if(ADS.getLocalStorage('surname')){
                this.$router.push('/SurnameSelect?s='+ADS.getLocalStorage('surname')+'&py='+this.pinyin)
            }else{
                this.$router.push('/SelectSurname?s='+this.surname+'&py='+this.pinyin)
            }
        },
        checkData(){
            this.$store.dispatch('checkData',{url:'https://hms.qingtime.cn/checkData',body:{surname:(this.surOS[this.surname] ? this.surOS[this.surname] : this.surname)}});
        },
        getPinYin(){
            this.$store.dispatch('getPinYin',{url:'https://home.qingtime.cn/surname/surname/pinyin',body:{surname:(this.surOS[this.surname] ? this.surOS[this.surname] : this.surname)}}).then((data)=>{
                this.pinyin = data.data;
            });
        },
    },
    computed: {
        ...mapState({
            checkDatas: state => state.surname.checkDatas,
            surO: state => state.surname.surO,
            surOS: state => state.surname.surOS,
            province: state => state.surname.province,
            city: state => state.surname.city,
            district: state => state.surname.district,
        })
    },
    watch:{
        checkDatas(newV,oldV){
            // console.log(newV);
            this.entry.map((item,index)=>{
                item['show'] = this.checkDatas[this.entryObj[index]];
            });
        },
    },
};
</script>
<style>
.surnameExplorer_bg{
    /* background: url('../assets/selectSurname/bg.jpg') 50% 50% no-repeat;
    background: cover; */
}
.surnameExplorer_wrap{
    /* position: absolute; */
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* background: url('../assets/surnameExplorer/bg0.jpg') 50% 50%;
    background-repeat: no-repeat;
    background-size: auto 100%; */
}
.surnameExplorer_wrap_content{
    position: relative;
    width: calc(100% - 216px);
    height: calc(100% - 501px);
    padding: 0 108px;
    overflow: hidden;
}
.surnameExplorer_wrap_content_surname{
    display: block;
    color: #fff;
    font-size: 50px;
    display: flex;
}
.surnameExplorer_wrap_content_surname li{
    margin-right: 10px;
    /* display: flex;
    align-items: flex-end; */
    margin-right: 10px;
    text-align: center;
}
.surnameExplorer_wrap_content_surname div{
    width: 220px;
    height: 220px;
    line-height: 205px;
    background: url('../assets/surnameExplorer/tian.svg') 50% 50% no-repeat;
    font-size: 190px;
    font-family: 'KaiTi';
}
.surnameExplorer_wrap_content_surname span{
    height: 50px;
    line-height: 50px;
    display: inline-block;
}
.surnameExplorer_wrap_content_toggle{
    position: absolute;
    top: 0;
    right: -50px;
    display: block;
    width: 394px;
    height: 100px;
    line-height: 100px;
    font-size: 34px;
    background-color: rgba(255,255,255,0.9);
    text-indent: 50px;
    color: #5CB483;
    border-radius: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
}
.surnameExplorer_wrap_content_toggle img{
    margin-left: 50px;
}
.FS_logo{
    position: absolute;
    top: 0;
    right: 20px;
    display: block;
    height: 100px;
    cursor: pointer;
}
.surnameExplorer-carousel-box{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 280px);
}
.surnameExplorer_wrap_foot{
    position: fixed;
    left: 0;
    bottom: 0;
    width: calc(100% - 216px);
    padding: 0 108px;
    height: 280px;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: space-between;
    animation:  animate_moveBToTop 1.5s ease-in-out;
}
@keyframes animate_moveBToTop{
    from{
        bottom: -100%;
        opacity: 0;
    }
    to{
        bottom: 0;
        opacity: 1;
    }
}
.surnameExplorer_wrap_foot li{
    display: inline-block;
    width: 258px;
    text-align: center;
    color: #666;
    cursor: pointer;
}
.surnameExplorer_wrap_foot_img{
    position: relative;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: #5CB483;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: -110px auto 0 auto;
}
.surnameExplorer_wrap_foot_img p{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #e6a23c;
}
.surnameExplorer_wrap_foot_img img{
    width: 130px;
    height: 130px;
    display: block;
}
.surnameExplorer_wrap_foot li:nth-of-type(2) .surnameExplorer_wrap_foot_img{
    background: #F16458;
}
.surnameExplorer_wrap_foot li:nth-of-type(3) .surnameExplorer_wrap_foot_img{
    background: #27C4F4;
}
.surnameExplorer_wrap_foot li:nth-of-type(4) .surnameExplorer_wrap_foot_img{
    background: #FCB34B;
}
.surnameExplorer_wrap_foot li:nth-of-type(5) .surnameExplorer_wrap_foot_img{
    background: #BFD730;
}
.surnameExplorer_wrap_foot li:nth-of-type(6) .surnameExplorer_wrap_foot_img{
    background: #996799;
}
.surnameExplorer_wrap_foot h3{
    color: #333;
    margin: 15px 0;
}
.surnameExplorer_wrap_foot li.active{
    /* -webkit-filter: grayscale(100%); 
    -moz-filter: grayscale(100%); 
    -ms-filter: grayscale(100%); 
    -o-filter: grayscale(100%); 
    filter: grayscale(100%); 
    filter: gray;  */
    color: gray;
    cursor: wait;
}
.surnameExplorer_wrap_foot li.active .surnameExplorer_wrap_foot_img{
    background: #D7D7D7;
}
.surnameExplorer_wrap_foot li.active h3{
    color: gray;
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .surnameExplorer_wrap_content{
        width: calc(100% - 132px);
        height: calc(100% - 352px);
        padding: 0 66px;
    }
    .surnameExplorer_wrap_content_surname{
        font-size: 30px;
    }
    .surnameExplorer_wrap_content_surname div{
        width: 132px;
        height: 132px;
        line-height: 120px;
        font-size: 135px;
        background-size: cover;
    }
    .surnameExplorer_wrap_content_surname span{
        font-size: 30px;
        height: 30px;
        line-height: 30px;
    }
    .surnameExplorer_wrap_content_toggle{
        width: 240px;
        height: 60px;
        line-height: 60px;
        border-radius: 30px;
        right: -30px;
        text-indent: 50x;
    }
    .surnameExplorer_wrap_content_toggle img{
        width: 156px;
        margin-left: 30px;
    }
    .surnameExplorer_wrap_foot{
        width: calc(100% - 132px);
        padding: 0 66px;
        height: 170px;
    }
    .surnameExplorer_wrap_foot li{
        width: 156px;
    }
    .surnameExplorer_wrap_foot_img{
        width: 132px;
        height: 132px;
        margin-top: -66px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .surnameExplorer_wrap_foot_img img{
        width: 90px;
        height: 90px;
    }
    .surnameExplorer_wrap_foot h3{
        font-size: 24px;
        margin: 10px 0;
    }
    .surnameExplorer_wrap_foot p{
        font-size: 12px;
    }
}
</style>
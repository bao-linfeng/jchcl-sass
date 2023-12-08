<template>
    <div class="celebrity_wrap fontSize30 PingFang_Regular" @scroll.passive="scrollCelebrity">
        <div class="celebrity_nav_wrap">
            <img @click.stop="goBack" src="../assets/selectSurname/back_green.svg" alt="返回" />
            <div class="celebrity_nav_box">
                <div class="celebrity_nav_title_box">
                    <p class="fontSize48 PingFangSC_Medium">{{surname}}{{surO[surname] ? '('+surO[surname]+')' : ''}}氏名人 <i class="fontSize30 PingFang_Regular">共收录了 {{celebrityAllTotal}} 位{{surname}}{{surO[surname] ? '('+surO[surname]+')' : ''}}氏名人</i></p>
                    <!-- <span class="fontSize26 MuseoSlab300">Celebrity</span> -->
                </div>
                <div class="celebrity_nav_tag_box">
                    <label for="">所属区域:</label>
                    <div class="area-wrap">
                        <ul class="celebrity_nav_tag_box_ul">
                            <li @click="changeProvince('')" :class="{active:province==''}">全部</li>
                            <li v-for="(item,index) in provinceList" @click="changeProvince(item)" :key="'province'+index" :class="{active:province==item}">{{item}}</li>
                        </ul>
                        <ul class="celebrity_nav_tag_box_ul">
                            <li v-for="(item,index) in cityList" @click="changeCity(item)" :key="'city'+index" :class="{active:city==item}">{{item}}</li>
                        </ul>
                    </div>
                </div>
                <div class="celebrity_nav_tag_box">
                    <label for="">所属领域:</label>
                    <ul class="celebrity_nav_tag_box_ul">
                        <li @click="changeLabel('')" :class="{active:industry==''}">全部</li>
                        <li v-for="(item,index) in celebrityLabelList" @click="changeLabel(item)" :key="'tag'+index" :class="{active:industry==item}">{{item}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="celebrity_content_wrap">
            <div class="celebrity_content_dynasty_wrap">
                <!-- <i class="line"></i>
                <i class="circle"></i>
                <div class="dynasty_title">
                    <p class="dynasty p">{{dynasty ? dynasty : '全部'}}</p>
                    <span class="dynasty_time pf" v-if="celebrityDynastyList[dynastyTab]">{{celebrityDynastyList[dynastyTab].year > 0 ? celebrityDynastyList[dynastyTab].year : (-celebrityDynastyList[dynastyTab].year+'BC')}}</span>
                    <span class="people_count pf">(共{{celebrityTotal}}人)</span>
                </div> -->
                <div class="dynasty_people_wrap" :class="{shao:celebrityList.length < 5}">
                    <router-link :to="'/CelebrityProfile?s='+surname+'&id='+item2._key+'&py='+pinyin" v-for="(item2,index2) in celebrityList" :key="'people'+index2">
                        <div class="avatar" :style="{backgroundImage:'url('+item2.img+')'}"></div>
                        <h3>{{item2.name}}</h3>
                        <p class="fontSize26">{{item2.identity}}</p>
                        <p class="fontSize26">{{item2.birthDate}} - {{item2.deadDate}}</p>
                    </router-link>
                </div>
            </div>
        </div>
        <!-- <div class="celebrity_tool_wrap">
            <div class="celebrity_tool_title_wrap p">选择朝代</div>
            <ul class="celebrity_tool_dynasty_wrap">
                <li v-for="(item,index) in celebrityDynastyList" :key="'dynasty'+index" @click="changeTab(item,index)">
                    <p>{{item.name}}</p>
                    <span class="pf">{{item.year > 0 ? item.year : (-item.year+'BC')}}</span>
                    <i></i>
                    <img v-show="dynastyTab == index" src="../assets/huadong.svg" alt="" />
                </li>
            </ul>
        </div> -->
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import AdaiTitle from "../components/adai/AdaiTitle.vue";
export default {
    name: "Celebrity",
    components: {
        AdaiTitle,
    },
    data: () => {
        return {
            startTime: 0,
            pinyin: '',
            surname: '',
            dynasty: '',
            industry: '',
            dynastyTab:0,
            dynastys: [
                {name: '汉朝',time:-202},
                {name: '三国两晋南北朝',time:184},
                {name: '隋朝',time:581},
                {name: '唐朝',time:618},
                {name: '五代十国',time:907},
                {name: '宋朝',time:960},
                {name: '元',time:1271},
                {name: '明朝',time:1368},
                {name: '清朝',time:1636},
                {name: '近现代',time:1840}
            ],
            provinceList: [],
            province: '',
            cityList: [],
            city: '',
            page: 1,
            limit: 60,
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname;
        this.pinyin = pinyin;
        this.startTime = Date.now();
        this.province = ADS.getLocalStorage('province') || '';
        this.city = ADS.getLocalStorage('city') || '';
    },
    mounted:function(){
        this.getProvince();
        if(this.city){
            this.getCity();
        }
        this.getCelebrityLabel();
        this.getCelebrityList();
        this.getCelebrityDynasty();
    },
    destroyed:function(){
      this.clickNum('姓氏名人', 'L1', Date.now() - this.startTime)
    },
    methods:{
        scrollCelebrity(e){
            if(Math.ceil(e.target.clientWidth + e.target.scrollLeft) >= e.target.scrollWidth){
                if(this.page < this.celebrityPages){
                    console.log('到底了');
                    this.page = this.page + 1;
                    this.getCelebrityList();
                }else{
                    // ADS.message('暂无数据啦');
                }
            }
        },
        async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        async getProvince(){
            let result = await ADS.AdaiXHR('https://home.qingtime.cn/surname/celebrity/province',{'surname': this.surname},'GET',true);
            this.provinceList = result.data;
        },
        async getCity(){
            let result = await ADS.AdaiXHR('https://home.qingtime.cn/surname/celebrity/province/city',{'surname': this.surname, 'area': this.province},'GET',true);
            this.cityList = result.data;
        },
        changeProvince(pro){
            this.province = pro;
            this.city = '';
            this.cityList = [];
            if(pro){
                this.getCity();
            }
            
            this.getCelebrityList();
        },
        changeCity(data){
            this.city = data;
            this.getCelebrityList();
        },
        changeLabel(item){
            this.industry = item;
            this.getCelebrityList();
        },
        changeTab(item,i){
            this.dynastyTab = i;
            this.dynasty = item.name;
            this.getCelebrityList();
            // document.getElementById('dynasty'+i).scrollIntoView();
        },
        goBack(){
            this.$router.push('/SurnameExplorer?s='+this.surname+'&py='+this.pinyin);
        },
        getCelebrityDynasty(){
            this.$store.dispatch('getCelebrityDynasty',{url:'https://home.qingtime.cn/surname/celebrity/dynasty',body:{surname:this.surname}});
        },
        getCelebrityLabel(){
            this.$store.dispatch('getCelebrityLabel',{url:'https://home.qingtime.cn/surname/celebrity/industry',body:{surname:this.surname,dynasty:this.dynasty}});
        },
        getCelebrityList(){
            this.$store.dispatch('getCelebrityList',{url:'https://home.qingtime.cn/surname/celebrity',body:{surname:this.surname,dynasty:this.dynasty,industry:this.industry,area: this.province,city: this.city,page: this.page,limit: this.limit}});
        },
    },
    computed: {
        ...mapState({
            surnames: state => state.surname.surnames,
            celebrityLabelList:state => state.surname.celebrityLabelList,
            celebrityTotal:state => state.surname.celebrityTotal,
            celebrityList:state => state.surname.celebrityList,
            celebrityPages: state => state.surname.celebrityPages,
            celebrityDynastyList:state => state.surname.celebrityDynastyList,
            celebrityAllTotal:state => state.surname.celebrityAllTotal,
            surO: state => state.surname.surO,
        })
    },
    watch:{
        'celebrityDynastyList':function(newV,oldV){
            if(newV && newV.length){
                // this.dynasty = newV[0].name;
                // this.getCelebrityList();
            }
        },
    },
};
</script>
<style scoped lang="scss">
.celebrity_wrap{
    position: relative;
    // width: calc(100% - 270px);
    width: 100%;
    height: 100%;
    // padding-right: 270px;
    overflow-y: auto;
}
.celebrity_nav_wrap{
    position: relative;
    width: 100%;
    background: #F9F9F9;
    display: flex;
    padding: 40px 0 5px 0;
    border-bottom: 1px solid #CCCCCC;
    img{
        width: 68px;
        height: 68px;
        cursor: pointer;
        margin: 0 20px 0 36px;
        display: block;
    }
    .celebrity_nav_box{
        width: calc(100% - 124px);
        .celebrity_nav_title_box{
            color: #333;
            span{
                color: #999;
            }
            i{
                font-style: normal;
                color: #999;
                padding-left: 20px;
                border-left: 1px solid #ccc;
                margin-left: 20px;
            }
        }
        .celebrity_nav_tag_box{
            color: #666;
            display: flex;
            margin-top: 20px;
            label{
                display: inline-block;
                width: 150px;
                height: 40px;
                line-height: 40px;
            }
            .area-wrap{
                width: calc(100% - 150px);
            }
            .celebrity_nav_tag_box_ul{
                display: flex;
                width: 100%;
                color: #999;
                display: flex;
                flex-wrap: wrap;
                li{
                    background: #EFF0F0;
                    border-radius: 8px;
                    height: 42px;
                    line-height: 42px;
                    padding: 0 25px;
                    margin: 0 15px 15px 0;
                    cursor: pointer;
                    &.active{
                        background: var(--text-color);
                        color:#fff;
                    }
                }
            }
        }
    }
}
.celebrity_content_wrap{
    padding: 20px 0 20px 36px;
    // overflow-y: auto;
}
.celebrity_content_dynasty_wrap{
    position: relative;
    color: #666;
    .circle{
        position: absolute;
        top: 9px;
        left: -11px;
        width: 22px;
        height: 22px;
        display: block;
        border-radius: 11px;
        background: #5CB483;
    }
    .line{
        position: absolute;
        top: 9px;
        left: 0;
        width: 1px;
        height: 100%;
        background: #ccc;
    }
    .dynasty_title{
        display: flex;
        align-items: flex-end;
        padding-left: 30px;
        span{
            color: #999;
            margin-left: 15px;
        }
    }
    .dynasty_people_wrap{
        // display: flex;
        // justify-content: space-around;
        // flex-wrap: wrap;
        overflow: hidden;
        // overflow-y: auto;
        a{
            color: #333;
            width: 284px;
            height: 500px;
            margin: 20px 18px 0 0;
            display: block;
            float: left;
            .avatar{
                width: 100%;
                height: 370px;
                background-color: #ddd;
                background-position: 50% 50%;
                background-repeat: no-repeat;
                background-size: cover;
            }
            h3{
                margin: 10px 0 5px 0;
                font-size: 3rem;
                font-weight: normal;
            }
            p{
                color: #999;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        &.shao{
            justify-content: flex-start;
            a{
                margin-left: 20px;
            }
        }
    }
}
.celebrity_tool_wrap{
    position: fixed;
    width: 270px;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,0.90);
    box-shadow: 0 4px 8px 0 rgba(114,68,21,0.62);
    .celebrity_tool_title_wrap{
        background: #F1F1F1;
        height: 80px;
        line-height: 80px;
        color: #5CB483;
        text-indent: 42px;
    }
    .celebrity_tool_dynasty_wrap{
        display: block;
        height: calc(100% - 120px);
        padding: 20px 30px 20px 0;
        text-align: right;
        li{
            position: relative;
            padding-right: 30px;
            height: 15%;
            cursor: pointer;
            p{
                color: #666;
                font-size: 2.4rem;
            }
            span{
                color: #999;
            }
            i{
                position: absolute;
                top: 0;
                right: 0;
                display: inline-block;
                width: 16px;
                background-image: linear-gradient(180deg, #F16458 0%, #F26E56 100%);
                border-radius: 8px;
                height: 100%;
            }
            img{
                width: 30px;
                position: absolute;
                top: -13px;
                right: -20px;
                cursor: pointer;
            }
            &:nth-of-type(2){
                height: 15%;
                i{
                    background-image: linear-gradient(180deg, #F16458 0%, #F26E56 100%);
                }
            }
            &:nth-of-type(3){
                height: 5%;
                i{
                    background-image: linear-gradient(180deg, #F26D56 0%, #F47C54 100%);
                }
            }
            &:nth-of-type(4){
                height: 13%;
                i{
                    background-image: linear-gradient(180deg, #F68951 0%, #F78F51 100%);
                }
            }
            &:nth-of-type(5){
                height: 5%;
                i{
                    background-image: linear-gradient(180deg, #F79250 0%, #FAA74C 100%);
                }
            }
            &:nth-of-type(6){
                height: 12%;
                i{
                    background-image: linear-gradient(180deg, #F7B450 0%, #D6B669 100%);
                }
            }
            &:nth-of-type(7){
                height: 5%;
                i{
                    background-image: linear-gradient(180deg, #F7B450 0%, #ABB98A 100%);
                }
            }
            &:nth-of-type(8){
                height: 10%;
                i{
                    background-image: linear-gradient(180deg, #53C0D0 0%, #39C2E5 100%);
                }
            }
            &:nth-of-type(9){
                height: 10%;
                i{
                    background-image: linear-gradient(180deg, #41C1C3 0%, #A9CC78 100%);
                }
            }
            &:nth-of-type(10){
                height: 10%;
                i{
                    background-image: linear-gradient(180deg, #5FBE8B 0%, #87B940 100%);
                }
            }
        }
    }
}
</style>
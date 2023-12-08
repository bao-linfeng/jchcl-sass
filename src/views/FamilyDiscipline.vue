<template>
    <div class="familyDiscipline_wrap">
        <AdaiCarousel :imgs="[1,2]" :name="'1'" />
        <AdaiTitle :path="'/SurnameExplorer?s='+surname+'&py='+pinyin" :count="'共收录了'+abstract.length+'条家规家训'" :title="surname+(surO[surname] ? '('+surO[surname]+')' : '')+'氏家规家训'" :titleE="'Family discipline'" />
        <div class="familyDiscipline_content_wrap style1 PingFangSC_Medium">
            <ul class="familyDiscipline_content_box familyDiscipline_content_box_2 style2 familyDiscipline_content_box_ani">
                <li v-for="(item,index) in abstract" :key="'familyDiscipline'+index" @click="showFamilyDiscipline(item.id,index)" :class="{active:jiaGuis.indexOf(index) > -1}">
                    <img class="left" src="../assets/lines/left.png" alt="">
                    <div>
                        <h3 class="fontSize40 KaiTi">{{item.abstract}}</h3>
                        <i class="fontSize18 PingFang_Regular">{{item.label}}</i>
                        <span class="fontSize20">查看详情</span>
                    </div>
                    <img class="right" src="../assets/lines/right.png" alt="">
                </li>
            </ul>
        </div>
        <AdaiDiscipline2 v-if="isShow" v-on:close-discipline="isShow=false" />
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import AdaiTitle from "../components/adai/AdaiTitle.vue";
import AdaiDiscipline2 from "../components/adai/AdaiDiscipline2.vue";
import AdaiLoading from "../components/adai/AdaiLoading.vue";
import AdaiCharging from "../components/adai/AdaiCharging.vue";
import AdaiTimeLine from "../components/adai/AdaiTimeLine.vue";
import AdaiCarousel from "../components/adai/AdaiCarousel.vue";
export default {
    name: "FamilyDiscipline",
    components: {
        AdaiTitle,AdaiDiscipline2,AdaiLoading,AdaiCharging,AdaiTimeLine,AdaiCarousel
    },
    data: () => {
        return {
            pinyin:'',
            surname:'',
            isShow:false,
            place:'',
            id:'',
            jiaGuis:[],
            abstract:[],
            startTime: 0,
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname;
        this.pinyin = pinyin;
        this.startTime = Date.now();
    },
    mounted:function(){
        this.getFamilyDisciplineList();
    },
    destroyed:function(){
      this.clickNum('家风家训', 'L1', Date.now() - this.startTime)
    },
    methods:{
        async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        showFamilyDiscipline(id,index){
            this.id = id;
            this.isShow = true;
            if(this.jiaGuis.indexOf(index) == -1){
                this.jiaGuis.push(index);
            }
            this.getFamilyDisciplineDetail();
        },
        getFamilyDisciplineList(){
            this.$store.dispatch('getFamilyDisciplineList',{url:'familyRule',body:{surname:this.surname,place:this.place}});
        },
        getFamilyDisciplineDetail(){
            this.$store.dispatch('getFamilyDisciplineDetail',{url:'familyRule/detail',body:{ruleKey:this.id}});
        },
    },
    computed: {
        ...mapState({
            familyDisciplineList: state => state.surname.familyDisciplineList,
            surO: state => state.surname.surO,
        })
    },
    watch:{
        'familyDisciplineList':function(newV,oldV){
            if(newV && newV.length){
                let abstract = [];
                newV.map((item)=>{
                    if(item.abstract){
                        (item.abstract.split('n/')).map((item2)=>{
                            abstract.push({id:item._key,abstract:item2,label:item.label});
                        });
                    }
                });
                console.log(abstract);
                this.abstract = abstract;
            }
        },
    },
};
</script>
<style scoped lang="scss">
.familyDiscipline_wrap{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    // background: url('../assets/familyDiscipline/bg.jpg') 50% 50% no-repeat;
    // background-size: cover;
    // background-attachment: fixed;
    // display: flex;
    // flex-direction: column;
}
.familyDiscipline_place_toggle{
    position: absolute;
    top: 40px;
    right: 0;
    display: block;
    width: 394px;
    height: 100px;
    line-height: 100px;
    background: rgba(255,255,255,0.9) url('../assets/genealogy/map.svg') 25px 50% no-repeat;
    background-size: 50px 50px;
    text-indent: 90px;
    color: #666;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    cursor: pointer;
}
.familyDiscipline_content_wrap{
    position: absolute;
    top: 178px;
    right: 74px;
    bottom: 20px;
    left: 74px;
    overflow: hidden;
    // width: calc(100% - 144px);
    // height: calc(100% - 201px);
    // margin: 0 auto;
    // display: flex;
    // justify-content: flex-end;
    // overflow-y: auto;
}
.familyDiscipline_content_box{
    position: absolute;
    top: 0;
    right: 72px;
    display: flex;
    width: 1100px;
    height: 100%;
    flex-wrap: wrap;
    li{
        position: relative;
        width: 388px;
        height: 276px;
        // padding: 46px 56px;
        // background: url('../assets/familyDiscipline/box2.png') 0 0 no-repeat;
        background-size: 100% 100%;
        margin: 0 55px 40px 45px;
        .left{
            position: absolute;
            top: 0;
            left: -30px;
            height: 877px;
            display: block;
        }
        .right{
            position: absolute;
            height: 877px;
            top: 0;
            right: -30px;
            display: block;
        }

        h3{
            height: 100%;
            color: var(--bg-color);
            // overflow: hidden;
            // white-space: nowrap;
            // text-overflow: ellipsis;
        }
        .label{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .desc{
            color: #666;
            margin-top: 15px;
        }
        span{
            color: #5CB483;
            display: block;
            text-align: center;
            cursor: pointer;
        }
        &.active{
            color:#999;
            h3{
                color:#999;
            }
            span{
                color:#999;
            }
        }
        // &:nth-of-type(2n){
        //     margin: 0;
        // }
    }
}
.familyDiscipline_content_box_ani{
    animation: animate_rightToLeft 5s ease-in-out;
}
@keyframes animate_rightToLeft{
    from{
        right:-100%;
        opacity: 0;
    }
    to{
        right: 72px;
        opacity: 1;
    }
}
.familyDiscipline_content_box_2{
    overflow-x: auto;
    overflow-y: hidden;
    flex-wrap: nowrap;
    // height: calc(100% - 6px);
    li{
        position: relative;
        width: auto;
        // padding: 8px 0;
        // border:1px solid #979797;
        height: 877px;
        background-color: transparent;
        margin-bottom: 0;
        cursor: pointer;
        div{
            position: relative;
            // width: 180px;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction:row-reverse;
            height: calc(100% - 90px);
            padding: 30px 20px 60px 20px;
            background: url('../assets/lines/mid.png') 0 0 repeat-x;
            background-size: auto 100%;
            // background: rgba(255,255,255,0.9);
        }
        i{
            writing-mode:tb-rl;
            text-align: left;
            line-height: 2rem;
            letter-spacing: 0px;
            color: #333;
            font-style: normal;
            margin-right: 10px;
        }
        h3{
            writing-mode:tb-rl;
            text-align: left;
            line-height: 4.4rem;
            letter-spacing: 1px;
            color: #000;
            font-weight: normal;
        }
        .label{
            writing-mode:tb-rl;
            text-align: center;
            line-height: 2.8rem;
            letter-spacing: 2px;
            margin: 30px 0 0 0;
        }
        .desc{
            display: none;
        }
        span{
            position: absolute;
            left: 50%;
            width: 100%;
            transform: translateX(-50%);
            bottom: 20px;
        }
    }
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .familyDiscipline_content_wrap{
        top: 120px;
    }
    .familyDiscipline_content_box_2{
        width: 1000px;
        li{
            margin: 0 24px 0 0;
            div{
                width: 140px;
            }
            h3{
                font-size: 24px;
                line-height: 26px;
            }
            i{
                font-size: 14px;
                line-height: 16px;
            }
            span{
                font-size: 14px;
            }
        }
    } 
}
</style>
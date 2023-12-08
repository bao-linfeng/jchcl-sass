<template>
    <div class="GenealogySummary_wrap fontSize38 PingFang_Regular">
        <AdaiTitle :theme="'theme'" :path="province ? '/CatalogSearch?s='+surname+'&py='+pinyin : '/GenealogyCollection?s='+surname+'&py='+pinyin" :title="'家谱简介'" :titleE="'Brief introduction of genealogy'" />
        <div class="GenealogySummary_content_wrap">
            <div class="GenealogySummary_cover_wrap">
                <div class="GenealogySummary_cover_box">
                    <i class="p">{{genealogySummary.genealogyName}}</i>
                </div>
                <router-link v-if="genealogySummary.hasImage == 1" class="a_button fontSize48 PingFangSC_Medium" :to="'/view?id='+id+'&n='+genealogySummary.genealogyName">立即阅读</router-link>
            </div>
            <ul class="GenealogySummary_desc_wrap">
                <li class="title"><h3 class="fontSize48 PingFangSC_Medium" :title="genealogySummary.genealogyName">{{genealogySummary.genealogyName}}</h3></li>
                <li><label class="PingFangSC_Medium">版本年：</label><span>{{genealogySummary.publish || '不详'}}</span></li>
                <li><label class="PingFangSC_Medium">谱籍地：</label><span>{{genealogySummary.place || '不详'}}</span></li>
                <li><label class="PingFangSC_Medium">堂&nbsp;&nbsp;&nbsp;号：</label><span>{{genealogySummary.hall || '不详'}}</span></li>
                <li><label class="PingFangSC_Medium">始&nbsp;&nbsp;&nbsp;祖：</label><span>{{genealogySummary.ancestor || '不详'}}</span></li>
                <li><label class="PingFangSC_Medium">始迁祖：</label><span>{{genealogySummary.originalAncestor || '不详'}}</span></li>
                <li><label class="PingFangSC_Medium">修撰者：</label><span>{{genealogySummary.authors || genealogySummary.author || '不详'}}</span></li>
                <!-- <li><label class="PingFangSC_Medium">馆藏地：</label><span v-for="(item,index) in genealogySummary.attach" :key="'attach'+index">{{item.name || '上海图书馆'}}</span></li> -->
            </ul>
            <div class="GenealogySummary_s_wrap">
                <label class="PingFangSC_Medium">摘&nbsp;&nbsp;&nbsp;要：</label><span>{{genealogySummary.desc || '不详'}}</span>
            </div>
        </div>
        <!-- <div class="GenealogySummary_qrcode_wrap">
            <div class="qrcode_box" id="qrcode_box"></div>
            <p class="fontSize30">扫码读家谱</p>
        </div> -->
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import AdaiTitle from "../components/adai/AdaiTitle.vue";
import ADS from "../utils/ADS.js";
export default {
    name: "GenealogySummary",
    components: {
        AdaiTitle
    },
    data: () => {
        return {
            pinyin:'',
            surname:'',
            id:'',
            startTime: 0,
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '',id=param['id'] || '';
        this.surname = surname;
        this.pinyin = pinyin;
        this.id = id;
        this.startTime = Date.now();
    },
    mounted:function(){
        this.getGenealogySummary();
    },
    destroyed:function(){
      this.clickNum('姓氏族谱', 'L1', Date.now() - this.startTime)
    },
    methods:{
        async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        qrcode(){
            let qrcode=new QRCode('qrcode_box',{
                text: (window.location.origin+'/view?id='+this.id) || this.genealogySummary.imageLink,
                width: 180,
                height: 180,
                colorDark : '#000000',
                colorLight : '#ffffff',
                correctLevel : QRCode.CorrectLevel.H
            });
        },
        getGenealogySummary(){
            this.$store.dispatch('getGenealogySummary',{url:'https://pumudata.qingtime.cn/fdc/catalogDetail',body:{catalogKey:this.id}});
        },
    },
    computed: {
        ...mapState({
            genealogySummary: state => state.surname.genealogySummary,
            province: state => state.surname.province,
            city: state => state.surname.city,
            district: state => state.surname.district,
        })
    },
    watch:{
        'genealogySummary':function(newV,oldV){
            // this.qrcode();
        }
    }
};
</script>
<style scoped lang="scss">
.GenealogySummary_wrap{
    position: relative;
    width: 100%;
    min-height: 100%;
    background: #f1f1f1;
}
.GenealogySummary_content_wrap{
    width: calc(100% - 120px);
    margin: 0 auto;
    display: flex;
    padding-bottom: 60px;
    .GenealogySummary_cover_wrap{
        width: 33%;
        .GenealogySummary_cover_box{
            position: relative;
            width: 450px;
            height: 568px;
            color: #000;
            font-size: 3.2rem;
            background: #fff url('../assets/cover.jpg') 50% 50% no-repeat;
            background-size: cover;
            i{
                position: absolute;
                top: 140px;
                right: 160px;
                // bottom: 90px;
                max-height: 320px;
                font-style: normal;
                writing-mode:tb-rl;
                text-align: center;
                line-height: 36px;
                letter-spacing: 2px;
                color: #1e304f;
                background: #fff;
                box-shadow: 0 0 0 1px #162946, 0 0 0 5px #FFF9DD;
                font-family: 'TpldKhangXiDictTrial';
                padding: 5px 0;
            }
        }
        a{
            margin: 40px auto;
            width: 450px;
        }
    }
    .GenealogySummary_desc_wrap{
        width: 40%;
        li{
            &.title{
                height: 130px;
                line-height: 130px;
            }
            h3{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            label{
                color: #919191;
                display: inline-block;
                text-align-last: justify;
                height: 68px;
                line-height: 68px;
            }
            span{
                color: #919191;
                height: 68px;
                line-height: 68px;
            }
        }
    }
    .GenealogySummary_s_wrap{
        padding-top: 130px;
        width: 26%;
        color: #919191;
    }
}
.GenealogySummary_qrcode_wrap{
    position: fixed;
    top: 0;
    right: 60px;
    padding: 20px;
    color: #666;
    text-align: center;
    background: rgba(255,255,255,0.90);
    filter: drop-shadow(4px 4px 8px rgba(65,117,5,0.42));
    // box-shadow: 0 4px 8px 0 rgba(65,117,5,0.42);
    .qrcode_box{
        width: 180px;
        height: 180px;
    }
    &::after{
        position: absolute;
        top: 100%;
        left: 0;
        content: '';
        width: 0;
        height: 0;
        border-top: 110px solid rgba(255,255,255,0.90);
        border-right: 110px solid transparent;
        border-bottom: 110px solid transparent;
        border-left: 110px solid transparent;
    }
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .GenealogySummary_content_wrap{
        .GenealogySummary_cover_wrap{
            width: auto;
            margin-right: 30px;
            .GenealogySummary_cover_box{
                width: 270px;
                height: 340px;
                i{
                    line-height: 20px;
                    font-size: 18px;
                    top: 80px;
                    right: 100px;
                    max-height: 200px;
                }
            }
            a{
                margin: 24px 0;
                width: 270px;
            }
        }
        .GenealogySummary_desc_wrap{
            width: auto;
            li{
                &.title{
                    height: 40px;
                    line-height: 40px;
                }
                height: 40px;
                line-height: 40px;
            }
            h3{
                font-size: 30px;
            }
            label{
                font-size: 24px;
            }
            span{
                font-size: 24px;
            }
        }
        .GenealogySummary_s_wrap{
            font-size: 24px;
            padding-top: 48px;
        }
    }
    .GenealogySummary_qrcode_wrap{
        right: 30px;
    }
}
</style>


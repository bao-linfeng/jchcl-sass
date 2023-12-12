<template>
    <div class="catalog-wrap fontSize38 PingFang_Regular">
        <AdaiTitle :theme="'theme'" :path="'/SurnameExplorer?s='+surnameA+'&py='+pinyin" :title="surnameO+'氏家谱'" :titleE="'List of genealogy'" />
        <div class="main">
            <div class="catalog-content" :class="{active: !isSidebar}">
                <ul class="nav-wrap">
                    <li :class="{active: isShow == item.value}" v-show="index <= 1 || index == 2 && !isSidebar" v-for="(item, index) in navList" :key="index" @click="changeNav(item)">{{item.label}}</li>
                </ul>
                <div class="scroll-wrap">
                    <img class="left" src="../assets/scrollLeft.png" alt="">
                    <img class="right" src="../assets/scrollRight.png" alt="">
                </div>
                <CatalogList v-if="isShow == 1" :list="genealogyList" :surname="surnameO" :pinyin="pinyin" />
                <CatalogBox v-if="isShow == 2" :list="genealogyList" :surname="surnameO" :pinyin="pinyin" />
            </div>
            <div class="main-right" v-show="isSidebar">
                <div class="scroll-wrap active">
                    <img class="left" src="../assets/scrollLeft.png" alt="">
                    <img class="right" src="../assets/scrollRight.png" alt="">
                </div>
                <ul class="nav-wrap active">
                    <li @click="isSidebar = false">收起筛选</li>
                </ul>
                <div class="statistics">
                    <div class="box">
                        <h3 class="title">姓氏({{count}})</h3>
                        <ul class="list-wrap style1">
                            <li class="li" :class="{active: surnameO == item.surname}" v-for="(item, index) in genealogySurnameList" :key="index" @click="changeSurname(item)">{{item.surname}}({{item.length}})</li>
                        </ul>
                    </div>
                    <div class="box">
                        <h3 class="title">堂号</h3>
                        <ul class="list-wrap style1">
                            <li class="li" :class="{active: hall == item.hall}" v-for="(item, index) in listHall" :key="index" @click="changeProperty('hall', item.hall)">{{item.hall}}({{item.length}})</li>
                        </ul>
                    </div>
                    <div class="box">
                        <h3 class="title">修撰者</h3>
                        <ul class="list-wrap style1">
                            <li class="li" :class="{active: authors == item.authors}" v-for="(item, index) in listAuthors" :key="index" @click="changeProperty('authors', item.authors)">{{item.authors}}({{item.length}})</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import AdaiTitle from "../components/adai/AdaiTitle.vue";
import CatalogList from '../components/catalog/CatalogList.vue';
import CatalogBox from '../components/catalog/CatalogBox.vue';
import ADS from "../utils/ADS.js";
export default {
    name: "catalog",
    components: {
        AdaiTitle,
        CatalogList,
        CatalogBox,
    },
    data: () => {
        return {
            surnameO: '',
            pinyin: '',
            isShow: 1,
            navList: [
                {'label': '列表', 'value': '1'},
                {'label': '图库', 'value': '2'},
                {'label': '展开筛选', 'value': '3'},
            ],
            count: 0,
            surnameA: '',
            hall: '',
            authors: '',
            listAuthors: [],
            listHall: [],
            isSidebar: true,
        };
    },
    created:function(){
        this.surnameO = ADS.getQueryVariable('s') ? decodeURIComponent(ADS.getQueryVariable('s')) : '';
        this.surnameA = this.surnameO;
        this.pinyin = ADS.getQueryVariable('py') ? decodeURIComponent(ADS.getQueryVariable('py')) : '';
        console.log(this.domain);
    },
    mounted:function(){
        this.getGenealogy(this.surnameO);
        this.getCatalogSurnameList(this.surnameO);
        this.getCatalogHallAuthors(this.surnameO);
    },
    destroyed:function(){
        
    },
    methods:{
        changeSurname(data){
            this.hall = '';
            this.authors = '';
            this.surnameO = data.surname;
            this.getGenealogy(this.surnameO);
            this.getCatalogHallAuthors(this.surnameO);
        },
        changeProperty(p, v){
            if(this[p] === v){
                this[p] = '';
            }else{
                this[p] = v;
            }
            
            this.getGenealogy(this.surnameO);
        },
        changeNav(data){
            if(data.value <= 2){
                this.isShow = data.value;
            }else{
                this.isSidebar = true;
            }
        },
        getGenealogy(surname){
            this.$store.dispatch('changePropertyValue', {'property': 'genealogyList', 'value': []});
            this.$store.dispatch('getCatalogList', {
                url:'https://pumudata.qingtime.cn/fdc/catalogList', 
                body: {
                    surname: surname, 
                    hasImage: '', 
                    province: this.province,
                    city: this.city,
                    district: this.district,
                    'domain': this.catalogSource == 1 ? '' : this.domain,
                    hall: this.hall,
                    authors: this.authors,
                }
            });
        },
        getCatalogSurnameList(){
            this.$store.dispatch('changePropertyValue', {'property': 'genealogySurnameList', 'value': []});
            this.$store.dispatch('getCatalogSurnameList', {
                url:'https://pumudata.qingtime.cn/fdc/catalogSurname', 
                body: {
                    hasImage: '', 
                    province: this.province,
                    city: this.city,
                    district: this.district,
                    'domain': this.catalogSource == 1 ? '' : this.domain,
                }
            });
        },
        async getCatalogHallAuthors(surname){// fdc堂号作者统计
            let result = await ADS.AdaiXHR('https://pumudata.qingtime.cn/fdc/catalogHallAuthors', {
                surname: surname, 
                hasImage: '', 
                province: this.province,
                city: this.city,
                district: this.district,
                'domain': this.catalogSource == 1 ? '' : this.domain,
            }, 'GET', true);
            if(result.status == 200){
                this.listAuthors = result.data.listAuthors || [];
                this.listHall = result.data.listHall || [];
            }
        },
    },
    computed: {
        ...mapState({
            logo: state => state.surname.logo,
            covers: state => state.surname.covers,
            surname: state => state.surname.surname,
            province: state => state.surname.province,
            city: state => state.surname.city,
            district: state => state.surname.district,
            genealogyList: state => state.surname.genealogyList,
            genealogySurnameList: state => state.surname.genealogySurnameList,
            catalogSource: state => state.surname.catalogSource,
            domain: state => state.surname.domain,
        })
    },
    watch:{
        'genealogySurnameList': function(nv, ov){
            nv.forEach((ele) => {
                this.count = this.count + ele.length;
            });
        }
    }
};
</script>
<style scoped lang="scss">
.catalog-wrap{
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 20px;
    .main{
        position: relative;
        width: 100%;
        height: calc(100% - 176px);
        display: flex;
        overflow: hidden;
        .main-right{
            position: relative;
            width: 218px;
            height: 100%;
            padding: 0 11px;
        }
    }
    .catalog-content{
        position: relative;
        height: calc(100% - 45px);
        width: calc(100% - 337px);
        padding: 25px 36px 0 36px;
        &.active{
            width: calc(100% - 72px);
        }
    }
    .surname-wrap{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 240px;
        box-shadow: 0 4px 8px 0 #ddd;
        li{
            padding: 0 20px;
            height: 50px;
            line-height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            i{
                color: #333;
            }
            &.head{
                background-color: #ddd;
                .green{
                    color: #5CB483;
                    font-weight: bold;
                }
            }
        }
        .surname-box{
            position: relative;
            width: 100%;
            height: calc(100% - 50px);
            overflow-y: auto;
            li{
                &.active{
                    i{
                        color: #5CB483;
                    }
                }
            }
        }
    }
}
.nav-wrap{
    position: absolute;
    top: -50px;
    right: 36px;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 18px;
    &.active{
        right: 0;
    }
    li{
        cursor: pointer;
        margin-left: 20px;
        &.active{
            color: #358acd;
        }
    }
}
.scroll-wrap{
    position: absolute;
    top: 0;
    left: 36px;
    width: calc(100% - 72px);
    height: 25px;
    background: url('../assets/scroll.png') 0 0 repeat-x;
    &.active{
        left: 11px;
        width: calc(100% - 22px);
    }
    .left{
        position: absolute;
        left: -11px;
        top: 0;
    }
    .right{
        position: absolute;
        right: -11px;
        top: 0;
    }
}
.statistics{
    height: calc(100% - 45px);
    padding: 25px 20px 20px 20px;
    font-size: 16px;
    .box{
        height: calc(33.33% - 20px);
        margin-top: 20px;
    }
    .title{
        border-left: 4px solid #333;
        padding-left: 10px;
        margin-bottom: 20px;
        height: 14px;
        line-height: 14px;
    }
    .list-wrap{
        height: calc(100% - 34px);
        overflow-y: auto;
        .li{
            text-indent: 14px;
            margin-bottom: 5px;
            cursor: pointer;
            &.active{
                color: #358acd;
            }
        }
    }
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    
}
</style>


<template>
    <div class="surnameExplorer_bg1">
        <div class="surnameExplorer_wrap1">
            <div class="surnameExplorer-carousel-box">
                <AdaiCarousel :imgs="[1,2]" />
            </div>
            <div class="adai_title_wrap">
                <img @click.stop="goBack('/?t='+domain)" :src="require('../assets/selectSurname/back.svg')" alt="返回" />
                <div class="adai_title_box">
                    <p class="fontSize48 PingFangSC_Medium">选择姓氏</p>
                    <span class="fontSize26 MuseoSlab300">Surname Select</span>
                </div>
            </div>
            <div class="surnameExplorer_wrap_content1">
                <ul class="surnameExplorer_wrap_content_surname1">
                    <li v-for="(item,index) in surname" :key="'surname'+index" @click.stop="goBack('/surnameExplorer?s='+item+'&py=')">
                        <div>{{item}}</div>
                        <span class="MuseoSlab300">{{pinyin ? pinyin.split(' ')[index] : ''}}</span>
                    </li>
                    <li v-if="surO[surname]">
                        <div>{{surO[surname]}}</div>
                        <span class="MuseoSlab300">{{pinyin}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import AdaiCarousel from "../components/adai/AdaiCarousel.vue";
export default {
    name: "SurnameSelect",
    components: {
        AdaiCarousel,
    },
    data: () => {
        return {
            pinyin:'',
            surname:'',
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname.split(',');
        this.pinyin = pinyin;
        this.pinyin ? null : this.getPinYin();
    },
    mounted:function(){
        
    },
    methods:{
        async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        goBack(t){
            this.$router.push(t);
        },
        getPinYin(){
            this.$store.dispatch('getPinYin',{url:'https://home.qingtime.cn/surname/surname/pinyin',body:{surname:(this.surOS[this.surname] ? this.surOS[this.surname] : this.surname)}}).then((data)=>{
                this.pinyin = data.data;
            });
        },
    },
    computed: {
        ...mapState({
            surO: state => state.surname.surO,
            surOS: state => state.surname.surOS,
            province: state => state.surname.province,
            city: state => state.surname.city,
            district: state => state.surname.district,
            domain: state => state.surname.domain,
        })
    },
    watch:{

    },
};
</script>
<style>
.surnameExplorer_bg1{
    /* background: url('../assets/selectSurname/bg.jpg') 50% 50% no-repeat;
    background: cover; */
}
.surnameExplorer_wrap1{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.surnameExplorer_wrap_content1{
    margin: 200px 108px 0 108px;
    position: relative;
    width: calc(100% - 216px);
    /* height: 320px; */
    overflow-x: auto;
    overflow-y: hidden;
}
.surnameExplorer_wrap_content_surname1{
    display: block;
    color: #fff;
    font-size: 50px;
    display: flex;
}
.surnameExplorer_wrap_content_surname1 li{
    margin-right: 40px;
    text-align: center;
    width: 320px;
    height: 320px;
}
.surnameExplorer_wrap_content_surname1 div{
    width: 320px;
    height: 320px;
    line-height: 305px;
    background: url('../assets/surnameExplorer/tian.svg') 50% 50% no-repeat;
    background-size: cover;
    font-size: 290px;
    font-family: 'KaiTi';
}
.surnameExplorer_wrap_content_surname1 span{
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
    height: 100%;
}

@media screen and (max-width: 1366px) and (min-width: 1050px){
    .surnameExplorer_wrap_content1{
        width: calc(100% - 132px);
        height: calc(100% - 352px);
        padding: 0 66px;
    }
    .surnameExplorer_wrap_content_surname1{
        font-size: 30px;
    }
    .surnameExplorer_wrap_content_surname1 div{
        width: 132px;
        height: 132px;
        line-height: 120px;
        font-size: 135px;
        background-size: cover;
    }
    .surnameExplorer_wrap_content_surname1 span{
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
}
</style>
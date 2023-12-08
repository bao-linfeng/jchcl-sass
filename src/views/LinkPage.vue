<template>
    <div class="linkPage_wrap">
        <CarouselModule :imgs="covers" />
        <div class="linkPage_wrap_content PingFangSC_Medium">
            <h1 class="fontSize70">{{title}}</h1>
            <h2 class="fontSize60 PingFang_Regular marginTop10">君从何处来</h2>
            <p class="fontSize20 PingFang_Regular lineHeight30">在未知的过去到底是怎样的因缘际会让祖辈们走到一起，然后有了我们？</p>
            <p class="fontSize20 PingFang_Regular lineHeight30">一起来揭秘姓氏背后的密码，发现姓氏源流故事吧。</p>
            <div class="fontSize48 btn" :to="'/SelectSurname'" @click="goRouter"><img class="linkPage_right" src="../assets/linkPage/right.svg" /><img class="linkPage_right1" src="../assets/linkPage/right1.svg" />开始探索</div>
        </div>
        <div class="linkPage_wrap_foot">
            <img class="logo" :src="logo || require('../assets/linkPage/logo.svg')" alt="logo" />
            <p class="customName fontSize20">{{customName}}</p>
            <!-- <p @click="fullScreen" class="fontSize22 PingFang_Regular">©{{year}} 时光科技 提供技术支持</p> -->
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import CarouselModule from "../components/adai/CarouselModule.vue";
export default {
    name: "linkPage",
    components: {
        CarouselModule
    },
    data: () => {
        return {
            year:2020,
            origin:'',
            flag:'',
        };
    },
    created:function(){
        let search = ADS.params(window.location.search);
        this.flag = search['i'] || '';
        this.origin = window.location.origin;
        if(this.flag){
            ADS.setLocalStorage('flag',this.flag);
        }else{
            this.flag = ADS.getLocalStorage('flag');
        }
    },
    mounted:function(){
        this.year = new Date().getFullYear();
        this.clickfdcModule('君从何处来');
    },
    methods:{
        goRouter(){
            if(this.surname){
                this.$router.push('/SurnameSelect?s='+this.surname+'&py='+this.pinyin);
            }else{
                this.$router.push('/SelectSurname');
            }
        },
        async clickfdcModule(name){
            let res = await ADS.AdaiXHR('https://fdcskcydata.qingtime.cn/config/fdcModule/click',{'name': name},'POST',true);
        },
        fullScreen() {
            var el = document.documentElement;
            var isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            if (!isFullscreen) { //进入全屏,多重短路表达式
                (el.requestFullscreen && el.requestFullscreen()) ||
                (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
                (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el.msRequestFullscreen && el.msRequestFullscreen());

            } else { //退出全屏,三目运算符
                document.exitFullscreen ? document.exitFullscreen() :
                    document.mozCancelFullScreen ? document.mozCancelFullScreen() :
                    document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
            }
        },
    },
    computed: {
        ...mapState({
            logo: state => state.surname.logo,
            covers: state => state.surname.covers,
            surname: state => state.surname.surname,
            pinyin: state => state.surname.pinyin,
            title: state => state.surname.title,
            customName: state => state.surname.customName,
        })
    },
};
</script>
<style>
.linkPage_wrap{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #f1f1f1;
    /* background: url('../assets/linkPage/bg.jpg') 50% 50% no-repeat;
    background-size: cover; */
}
.linkPage_wrap_content{
    position: absolute;
    top: 17.5%;
    left: 12.5%;
    color: #46658A;
}
.linkPage_wrap_content h1{
    /* font-size: 7rem; */
    font-family: PingFangSC-Medium;
    /* font-weight: normal; */
}
.linkPage_wrap_content h2{
    font-weight: normal;
}
.linkPage_wrap_content .btn{
    position: relative;
    width: 350px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    border-radius: 50px;
    background: #5CB483;
    color: #fff;
    margin-top: 40px;
    font-family: PingFangSC-Medium;
    box-shadow: inset -1px -1px 2px 0 rgba(255,255,255,0.50), inset 1px 1px 2px 0 rgba(255,255,255,0.50);
    text-indent: 50px;
}
.linkPage_wrap_content .pf{
    height:40px;
    line-height: 40px;
}
.linkPage_wrap_foot{
    position: absolute;
    width: calc(100% - 25%);
    bottom: 45px;
    padding: 0 12.5%;
    display: flex;
    justify-content: space-between;
    color: #fff;
    /* left: 12.5%; */
    /* text-align: right; */
}
/* .linkPage_wrap_foot p{
    color: #fff;
    text-indent: 20px;
}
.linkPage_wrap_foot a{
    position: relative;
    width: 350px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    border-radius: 50px;
    background: #87B940;
    color: #fff;
    margin-top: 20px;
    font-family: PingFangSC-Medium;
    box-shadow: inset -1px -1px 2px 0 rgba(255,255,255,0.50), inset 1px 1px 2px 0 rgba(255,255,255,0.50);
    text-indent: 50px;
} */
.linkPage_right{
    position: absolute;
    top: 50%;
    left: 55px;
    transform: translateY(-50%);
    height: 48px;
    animation: moveRight 1s ease-in-out infinite;
}
.linkPage_right1{
    position: absolute;
    top: 50%;
    left: 75px;
    transform: translateY(-50%);
    height: 48px;
    animation: moveRight 1s ease-in-out 1.2s infinite;
}
.linkPage_wrap_foot img.logo{
    width: 190px;
}
.customName{
    
}
@keyframes moveRight{
    from{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
}
.marginTop10{
    margin-top: 10px;
}
.marginTop20{
    margin-top: 20px;
}
.lineHeight30{
    line-height: 40px;
}
.marginTop100{
    margin: 100px 0 30px 0;
    font-size: 100px;
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .linkPage_wrap_content{
        top: 60px;
        left: 80px;
    }
    .linkPage_wrap_content h1{
        font-size: 42px;
    }
    .linkPage_wrap_content h2{
        font-size: 36px;
    }
    .linkPage_wrap_content p{
        font-size: 18px;
    }
    .linkPage_wrap_content a{
        width: 240px;
        height: 60px;
        line-height: 60px;
        border-radius: 30px;
        font-size: 30px;
        text-indent: 35px;
        margin-top: 12px;
    }
    .linkPage_right{
        left: 45px;
        height: 30px;
    }
    .linkPage_right1{
        left: 55px;
        height: 30px;
    }
    .linkPage_wrap_foot{
        bottom: 20px;
        left: 80px;
    }
    .linkPage_wrap_foot a{
        width: 240px;
        height: 60px;
        line-height: 60px;
        border-radius: 30px;
        font-size: 30px;
        text-indent: 35px;
        margin-top: 12px;
    }
    .linkPage_wrap_foot img.logo{
        width: 190px;
    }
    .lineHeight30{
        line-height: 24px;
    }
    .marginTop20{
        margin-top: 12px;
    }
}
</style>
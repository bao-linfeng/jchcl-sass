<template>
    <div class="about_wrap">
        <AdaiTitle :path="'/SurnameExplorer?s='+surname+'&py='+pinyin" :title="'FamilySearch为什么重视家谱'" :theme="'theme'" :titleE="'Why do FamilySearch care about Genealogy'" />
        <div class="about_content_wrap">
            <div class="about_video_wrap">
                <video :src="('https://cdn-icare.qingtime.cn/fdc视频.mp4')" autoplay="autoplay" controls="controls" loop="loop"></video>
            </div>
            <div class="about_content_box fontSize28 PingFang_Regular">
                <img src="../assets/about/jiahe.svg" alt="家和" />
                <p>天下之本在国，国之本在家，家之本在身。一《孟子，离娄_上》 修身，齐家，治国，平天下。-《礼记大学》 </p>
                <p>犹他家谱学会(FamilySearch)同意以上这些永恒的原则。 </p>
                <p>我们相信家庭的永恒本质。通过了解祖先的故事和教诲，我们将会有更多的力量来克服我们的挑战，有更好的机会培养和坚固我们的家庭。 </p>
                <p>我们相信更多地了解我们的祖先，会给我们的生活带来更多的欢乐，让生活变得更有意义。认识我们的祖先可以帮助我们更好地了解我们是谁，从而使我们的家庭纽带变得更加牢固，并将我们的现在与过去相连，架起一座通向未来的桥梁。 </p>
                <p>有恩爱在我家庭，遍处都尽美;有恩爱在我家庭，齐声同欢乐”。其实，这句话来自我们经常唱的一首歌。它的内涵很像中国人常说的"家和万事兴”。 </p>
                <p>因为我们很注重家庭，我们愿意将我们120多年以来积累的特有的家谱经验和科技手段分享给华人朋友们，使更多的家庭都能因此与过去、现在和将来的世世代代永远地联结起来。</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../utils/ADS.js";
import AdaiTitle from "../components/adai/AdaiTitle.vue";
export default {
    name: "surnameExplorer",
    components: {
        AdaiTitle,
    },
    data: () => {
        return {
            pinyin:'',
            surname:'',
            tab:0,
            reload:true,
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname;
        this.pinyin = pinyin;
    },
    mounted:function(){
        setTimeout(()=>{this.reload = false},500);
    },
    methods:{
        changeTab(i){
            this.tab = i;
        },
    },
    computed: {
        ...mapState({
            surnames: state => state.surname.surnames,
        })
    },
};
</script>
<style scoped lang="scss">
.about_wrap{
    position: relative;
    width: 100%;
    height: 100%;
    color: #999;
}
.about_title_wrap{
    height: 160px;
    display: flex;
    .about_title_left{
        width: 818px;
        margin-right: 50px;
        padding-left: 40px;
        h3{
            color: #87B940;
            font-weight: normal;
        }
    }
    .about_title_right{
        width: 920px;
    }
}
.about_content_wrap{
    display: flex;
    padding-bottom: 50px;
    justify-content: space-between;
    .about_video_wrap{
        width: 42%;
        background: #000;
        margin-top: 110px;
        display: flex;
        align-items: center;
        video{
            width: 100%;
            border: none;
            outline: none;
        }
    }
    .about_content_box{
        width: 55%;
        color: #666;
        p{
            line-height: 44px;
        }
    }
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .about_content_wrap{
        .about_video_wrap{
            width: 580px;
            height: 380px;
            margin-right: 30px;
            .video_box{
                width: 100%;
                height: auto;
            }
        }
        .about_content_box{
            width: calc(100% - 610px);
            font-size: 18px;
            p{
                line-height: 28px;
            }
        }
    } 
}
</style>
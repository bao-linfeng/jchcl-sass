<template>
    <div class="adai_load_card_wrap" @click="closeLoad">
        <div class="adai_load_card_box">
            <h3 class="fontSize48 PingFangSC_Medium">您知道吗？</h3>
            <!-- <p class="fontSize26 MuseoSlab300">Do you know？</p> -->
            <div class="q_box fontSize30 PingFang_Regular">
                <span v-for="(item,index) in q" :key="'card'+index" :class="{adaiCarousel_box_active:index == cardIndex}">{{item.t}}</span>
            </div>
        </div>
        <img src="../../assets/close.svg" class="close" />
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "adaiLoadCard",
    props:{
        surname:{
            type:String,
            default:''
        },
    },
    data: () => {
        return {
            slideon:'',
            cardIndex:0,
            q:[{t:'surname氏后裔们现在分布在全国哪些地方？'},{t:'哪个地方surname氏后裔人口最多？'},{t:'你的家乡有多少surname氏后裔？'}],
        };
    },
    created:function(){
        this.q.map((item)=>{item.t = item.t.replace('surname',this.surname)});
    },
    mounted:function(){
        this.slideshow();
    },
    beforeDestroy:function(){
        this.carouselClearInterval();
    },
    methods:{
        closeLoad(){
            this.$emit('close-loading',false);
        },
        carouselClearInterval(){
            clearInterval(this.slideon);
        },
        changeSlide() {
            this.cardIndex = this.cardIndex + 1; 
            if(this.cardIndex >= this.q.length) this.cardIndex = 0;
        },
        slideshow() {
            this.slideon = setInterval(() => {
                this.changeSlide()
            },3000);
        },
    },
};
</script>
<style scoped lang="scss">
.adai_load_card_wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    z-index: 1000000;
    text-align: center;
    background: rgba(0,0,0,0.4);
    .adai_load_card_box{
        position: absolute;
        top: calc(50% - 40px);
        left: 50%;
        transform: translate(-50%,-50%);
        width: 510px;
        height: 560px;
        padding: 0 20px;
        // border-radius: 10px;
        background: url('../../assets/card_bg.png') 50% 0 no-repeat;
        color: #666;
        overflow: hidden;
        h3{
            margin-top: 240px;
            font-weight: 500;
            color: #333;
        }
        p{
            margin-bottom: 50px;
            
        }
        .q_box{
            margin-top: 30px;
            position: relative;
            width: 390px;
            height: 60px;
            margin: 30px auto 0 auto;
            span{
                position: absolute;
                width: 100%;
                top: 50%;
                left: 50%;
                transform: translate(-50%,0);
                display: block;
                opacity: 0;
                transition: opacity 1s linear; 
                &.adaiCarousel_box_active{
                    opacity: 1; 
                    z-index: 10000;
                }
            }
        }
    }
    .close{
        position: absolute;
        left: 50%;
        bottom: 80px;
        transform: translateX(-50%);
        cursor: pointer;
    }
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .adai_load_card_wrap{
        .close{
            bottom: 20px;
            width: 54px;
            height: 54px;
        }
    } 
}
</style>
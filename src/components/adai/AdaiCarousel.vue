<template>
    <div class="adaiCarousel_wrap" @mouseover="carouselClearInterval" @mouseout="slideshow">
        <div class="adaiCarousel_box" :class="{adaiCarousel_box_active:index === current,'familyDiscipline':name==1 ,'linkPage':name == 2,'surnamePopulation':name == 3}" v-for="(item,index) in imgs" :key="'adaiCarousel_box'+index" @mouseover="carouselClearInterval">
            <!-- <img :src="require('../../assets/surnameExplorer/bg'+index+'.jpg')" alt="" /> -->
        </div>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "adaiCarousel",
    props:{
        imgs:{
            type:Array,
        },
        name:{
            type:String,
            default:''
        },
    },
    data: () => {
        return {
            current:0,
            slideon:'',
        };
    },
    mounted:function(){
        this.slideshow();
    },
    beforeDestroy:function(){
        this.carouselClearInterval();
    },
    methods:{
        carouselClearInterval(){
            clearInterval(this.slideon);
        },
        changeSlide() { //切换图片的函数
            // console.log(this.imgs.length);
            this.current = this.current + 1; //自增1
            if(this.current >= this.imgs.length) this.current = 0;
        },
        slideshow() {
            //每2s调用changeSlide函数进行图片轮播
            this.slideon = setInterval(() => {
                this.changeSlide()
            },5000);
        },
    },
};
</script>
<style>
.adaiCarousel_wrap{
    position: absolute;
    top: 0;
    left: 0;
   width: 100%;
   height: 100%; 
   overflow: hidden;
   z-index: -1;
}
.adaiCarousel_box{
    width: 100%;
    height: 100%;
    position: absolute; /*图片采取绝对定位，均位于左上角，重叠在一起*/
    top: 0;
    left: 0;
    opacity: 0; /*初始不透明度为0，图片都看不见*/
    transition: opacity 1s linear; /*--重点--定义一个关于透明度的transition*/
    background: url('../../assets/surnameExplorer/bg1.png') 50% 50% no-repeat;
    background-size: cover;
}
.adaiCarousel_box:nth-of-type(1){
    background-image: url('../../assets/surnameExplorer/bg1.png');
}
.adaiCarousel_box:nth-of-type(2){
    background-image: url('../../assets/surnameExplorer/bg2.png');
}
.familyDiscipline:nth-of-type(1){
    background-image: url('../../assets/familyDiscipline/bg.png');
}
.familyDiscipline:nth-of-type(2){
    background-image: url('../../assets/familyDiscipline/bg2.png');
}
.linkPage:nth-of-type(1){
    background-image: url('../../assets/linkPage/bg.png');
}
.linkPage:nth-of-type(2){
    background-image: url('../../assets/linkPage/bg2.png');
}
.surnamePopulation:nth-of-type(1){
    background-image: url('../../assets/surnamePopulation/bg.png');
}
.surnamePopulation:nth-of-type(2){
    /* background-image: url('../../assets/surnamePopulation/bg1.jpg'); */
}
.adaiCarousel_box_active{
    opacity: 1; /*有active类的图片不透明度为1，即显示图片*/
    z-index: 10000;
}
.adaiCarousel_box img{
    width: 100%;
    height: 100%;
    display: block;
    margin: 0 auto;
}
@keyframes circle{
    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }
}
</style>

<template>
    <div class="carousel-wrap" @mouseover="carouselClearInterval" @mouseout="slideshow">
        <div class="carousel-box" :class="{active: index === current}" :style="{backgroundImage: 'url('+item+')'}" v-for="(item, index) in imgs" :key="index" @mouseover="carouselClearInterval"></div>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "carouselModule",
    props:{
        imgs:{
            type:Array,
        },
    },
    data: () => {
        return {
            current: 0,
            slideon: '',
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
        changeSlide() {
            this.current = this.current + 1;
            if(this.current >= this.imgs.length) this.current = 0;
        },
        slideshow() {
            this.slideon = setInterval(() => {
                this.changeSlide()
            },5000);
        },
    },
};
</script>
<style>
.carousel-wrap{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; 
    overflow: hidden;
    z-index: -1;
}
.carousel-box{
    width: 100%;
    height: 100%;
    position: absolute; 
    top: 0;
    left: 0;
    opacity: 0; 
    transition: opacity 1s linear; 
    background: url('../../assets/surnameExplorer/bg1.png') 50% 50% no-repeat;
    background-size: cover;
}
.carousel-box.active{
    opacity: 1;
    z-index: 10000;
}
.carousel-box img{
    width: 100%;
    height: 100%;
    display: block;
    margin: 0 auto;
}
</style>

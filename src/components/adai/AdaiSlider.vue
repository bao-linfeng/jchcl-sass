<template>
    <input class="ne-range" v-model="rangePage" @change="changePage" type="range" :min="min" :max="max" :step="step" :style="{backgroundSize:(rangePage/max)*100+'% 100%' }" />
</template>
<script>
import ADS from '../../utils/ADS.js'
export default {
    props:{
        step:{
            type:Number,
            default:1
        },
        min:{
            type:Number,
            default:1
        },
        max:{
            type:Number,
            default:100
        },
        page:{
            type:Number,
            default:1
        },
    },
    data:function(){
        return {
            rangePage:0,
        }
    },
    created:function(){
        this.rangePage = this.page;
    },
    methods:{
        changePage(e){
            console.log('--',e.target.value);
            this.$emit('change-range',Number(e.target.value));
        },
    },
    computed:{
        
    },
    watch:{
        'page':function(newV,oldV){
            this.rangePage == newV ? null : this.rangePage = newV;
        },
    },
}
</script>
<style>
.ne-range_thumb,input.ne-range[type=range]::-webkit-slider-thumb {
    width: 2em;
    height: 2em;
    border-radius: 50%;
    border: 0/**1px solid #45bd5c*/;
    background-color: #5CB483;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.21);
    -webkit-transition: border-color 0.15s, background-color 0.15s;
    transition: border-color 0.15s, background-color 0.15s;
    cursor: pointer;
    background-clip: padding-box;
    box-sizing: border-box;
}
.ne-range_thumb:active,input.ne-range[type=range]{
    height: 8px;
    border-radius: 8px;
    margin: .8em 0;
    padding: 0;
    cursor: pointer;
    border: 0;
    /**background-color: #45bd5c;*/
    background: -webkit-linear-gradient(#87B940, #5CB483) no-repeat #cccccc;
    background-size: 0% 100%;
}
.ne-range_track > span {
    display: block;
    width: 0%;
    height: 100%;
    background-color: #5CB483;
}
.ne-range_tips {
    position: absolute;
    margin-top: -2em;
    width: 6em;
    text-align: center;
    margin-left: -3em;
}
.ne-range_thumb > .ne-range_tips {
    margin-left: -2.15em;
}
.ne-range_tips > span {
    position: relative;
    display: inline-block;
    padding: 0 3px;
    min-width: 1.2em;
    color: white;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 3px;
    text-align: center;
}
.ne-range_tips > span::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -0.25em;
    margin-left: -0.3em;
    border: 0.3em solid rgba(0, 0, 0, 0.5);
    border-right-color: transparent;
    border-left-color: transparent;
    border-bottom: 0;
}
/*Real Range*/
input.ne-range[type=range] {
    position: relative;
    outline: 0;
    -webkit-appearance: none !important;
}
input.ne-range[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none !important;
}
/*Virtual Range*/
.ne-range {
    display: inline-block;
    position: relative;
    width: 100%;
    font-size: 1em;
    background: -webkit-linear-gradient(#61bd12, #61bd12) no-repeat, #fff;
}
.ne-range_thumb {
    position: absolute;
    top: 0;
    margin-left: -0.85em;
}
.ne-range_thumb.ondrag > .ne-range_tips {
    visibility: visible;
}
</style>
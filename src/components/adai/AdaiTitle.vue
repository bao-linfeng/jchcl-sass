<template>
    <div class="adai_title_wrap" :class="theme">
        <img @click.stop="goBack" :src="require('../../assets/selectSurname/back'+(theme ? '_green' : '')+'.svg')" alt="返回" />
        <div class="adai_title_box">
            <p class="fontSize48 PingFangSC_Medium">{{title}}<i class="fontSize30 PingFang_Regular">{{count}}</i></p>
            <span class="fontSize26 MuseoSlab300">{{titleE}}</span>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "adaiTitle",
    props:{
        adai:{
            type:Boolean,
            default:false,
        },
        path:{
            type:String,
            default:'/',
        },
        title:{
            type:String,
            default:'选择姓氏',
        },
        titleE:{
            type:String,
            default:'Surname Select',
        },
        theme:{
            type:String,
            default:'',
        },
        count:{
            type:String,
            default:'',
        },
    },
    data: () => {
        return {
            
        };
    },
    created:function(){
        
    },
    methods:{
        goBack(){
            this.adai ? (window.location.href = window.location.origin + this.path) : this.$router.push(this.path);
        },
    },
};
</script>
<style>
.adai_title_wrap{
    position: relative;
    width: calc(100% - 20px);
    background: transparent;
    display: flex;
    padding: 40px 0;
}
.adai_title_wrap img{
    width: 68px;
    height: 68px;
    cursor: pointer;
    margin: 0 20px 0 36px;
}
.adai_title_box{
    color: #fff;
}
.adai_title_box p{
    font-weight: 400;
}
.adai_title_box i{
    color: #fff;
    margin-left: 40px;
}
.theme .adai_title_box{
    color: #333;
}
.theme .adai_title_box span{
    color: #999;
}
.adai_title_box span{
    display: block;
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .adai_title_wrap{
        padding: 24px 0;
    }
    .adai_title_wrap > img{
        width: 48px;
        height: 48px;
    }
    .adai_title_box{
        font-size: 18px;
    }
    .adai_title_box p{
        font-size: 34px;
    }
    .adai_title_box span{
        font-size: 18px;
    }
}
</style>

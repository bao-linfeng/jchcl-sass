<template>
    <div class="adaiDiscipline_wrap">
        <div class="adaiDiscipline_box">
            <ul class="adaiDiscipline_box_right adaiDiscipline_box_left" @click="next">
                <li class="fontSize26" v-for="(item,index) in memoList" :key="'right'+index" v-show="index >= (memoIndex*16-9) && index < memoIndex*16">{{item}}</li>
            </ul>
            <ul class="adaiDiscipline_box_right" @click="prev">
                <li class="title fontSize20">
                    <h3 class="fontSize30">{{familyDisciplineDetail.title}}</h3>
                    <p>{{familyDisciplineDetail.label}}</p>
                </li>
                <li class="fontSize26" v-for="(item,index) in memoList" :key="'right'+index" v-show="index < (memoIndex*16-9) && index >= (memoIndex-1)*16">{{item}}</li>
            </ul>
            <p class="page">{{memoIndex}}/{{pages}}</p>
        </div>
        <img class="close" src="../../assets/close.svg" @click="close" alt="关闭" />
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "adaiDiscipline",
    props:{
        
    },
    data: () => {
        return {
            memoIndex:1,
            pages:0,
        };
    },
    created:function(){
        
    },
    methods:{
        close(){
            this.$emit('close-discipline',false);
        },
        prev(){
            if(this.memoIndex > 1){
                this.memoIndex = this.memoIndex - 1;
            }
        },
        next(){
            if(this.memoIndex < this.pages){
                this.memoIndex = this.memoIndex + 1;
            }
        },
    },
    computed: {
        memoList:function(){
            let memo = this.familyDisciplineDetail.memo,i=0,count=24,n = Math.ceil(memo.length/count),momeArr=[];
            this.pages = Math.ceil(n/16);
            for(i=0;i<n;i++){
                momeArr.push(memo.substr(i*count,count));
            }
            // console.log(momeArr);
            return momeArr;
        },
        ...mapState({
            familyDisciplineDetail: state => state.surname.familyDisciplineDetail,
        })
    },
};
</script>
<style scoped lang="scss">
.adaiDiscipline_wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(255,255,255,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    .close{
        position: absolute;
        bottom: 36px;
        left: 50%;
        transform: translateX(-50%);
        cursor: pointer;
    }
}
.adaiDiscipline_box{
    width: 1018px;
    height: 720px;
    padding: 70px 65px;
    background: url('../../assets/genealogy/bg.png') 50% 50% no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    .page{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 30px;
    }
    .adaiDiscipline_box_right{
        width: 455px;
        height: 100%;
        background: #fff;
        border: 1px solid #999;
        display: flex;
        justify-content: flex-start;
        flex-direction:row-reverse;
        cursor: pointer;
        li{
            width: 50px;
            border-right: 1px solid #999;
            color: #333;
            writing-mode:tb-rl;
            text-align: center;
            line-height: 50px;
            letter-spacing: 2px;
            &:nth-of-type(1){
                border: none;
            }
            &.title{
                width: 100px;
                text-align: left;
                padding-top: 20px;
                h3{
                    width: 60px;
                    line-height: 60px;
                }
                p{
                    color: #999;
                    width: 40px;
                    line-height: 40px;
                }
            }
        }
    }
    .adaiDiscipline_box_left{
        width: 458px;
        li{
            &:nth-of-type(1){
                border: none;
            }
        }
    }
}
</style>

<template>
    <div class="adaiDiscipline_wrap">
        <div class="adai-discipline-content" :class="{active: !translationList.length}">
            <div class="adaiDiscipline_box" v-show="translationList && translationList.length">
                <img class="left" src="../../assets/familyDiscipline/left.png" alt="">
                <div class="adaiDiscipline_box_inner">
                    <ul class="adaiDiscipline_box_right style2">
                        <li class="title fontSize20">
                            <h3 class="fontSize30">{{familyDisciplineDetail.title}}</h3>
                            <p>{{familyDisciplineDetail.label}}</p>
                        </li>
                        <li class="fontSize26" v-for="(item,index) in translationList" :key="'right'+index" v-html="item"></li>
                    </ul>
                </div>
                <img class="right" src="../../assets/familyDiscipline/c.png" alt="">
            </div>
            <div class="adaiDiscipline_box" v-show="originalList && originalList.length">
                <img class="left" src="../../assets/familyDiscipline/left.png" alt="">
                <div class="adaiDiscipline_box_inner">
                    <ul class="adaiDiscipline_box_right style2">
                        <li class="title fontSize20">
                            <h3 class="fontSize30">{{familyDisciplineDetail.title}}</h3>
                            <p>{{familyDisciplineDetail.label}}</p>
                        </li>
                        <li class="fontSize26" v-for="(item,index) in originalList" :key="'right'+index" v-html="item"></li>
                    </ul>
                </div>
                <img class="right" src="../../assets/familyDiscipline/c.png" alt="">
            </div>
        </div>
        <img class="close" src="../../assets/close.svg" @click="close" alt="关闭" />
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "adaiDiscipline2",
    props:{
        
    },
    data: () => {
        return {
            w: 1920,
            originalList: [],
            translationList: [],
        };
    },
    created:function(){
        this.w = window.innerWidth;
    },
    mounted:function(){
        
    },
    methods:{
        close(){
            this.$emit('close-discipline',false)
        },
    },
    computed: {
        ...mapState({
            familyDisciplineDetail: state => state.surname.familyDisciplineDetail,
        })
    },
    watch: {
        'familyDisciplineDetail': function(nv, ov){
            let count = 28, original = nv.original || nv.content, originalList = [], translation = nv.translation, translationList = [], abstract = nv.abstract;
            original = original ? original.replace(/\s*/g,'') : '';
            translation = translation ? translation.replace(/\s*/g,'') : '';

            // 原文处理
            if(abstract){
                if(this.w >= 1050 && this.w < 1366){
                    count = 16;
                }
                abstract = abstract.split('n/');
                abstract.map((item)=>{
                    original = original.replace(item,('<i>'+item+'</i>'));
                });
            }
            console.log(count);
            
            let memoO = {0:''},o=0;
            for(let j=0;j<original.length;j++){
                if(memoO[o].replace(/<|i|>|\//g,'').length == count){
                    o++;
                    memoO[o] = '';
                }
                if(!memoO[o] || memoO[o].replace(/<|i|>|\//g,'').length < count){
                    memoO[o] = memoO[o] + original[j];
                }
            }

            function getA(str){
                let res = str.match(/<i>/g);
                let count = !res ? 0 : res.length;
                return count
            }
            function getB(str){
                let res = str.match(/<\/i>/g);
                let count = !res ? 0 : res.length;
                return count
            }

            for(let key in memoO){
                if(getA(memoO[key]) > getB(memoO[key])){
                    memoO[key] = memoO[key] + '</i>';
                }

                if(getA(memoO[key]) < getB(memoO[key])){
                    memoO[key] = '<i>' + memoO[key];
                }

                originalList.push(memoO[key]);
            }

            this.originalList = originalList;

            // 译文处理
            for(let k = 0; k < translation.length; k = k + count){
                translationList.push(translation.substr(k, count));
            }

            this.translationList = translationList;
        }
    }
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
    overflow: hidden;
    z-index: 1000;
    &::before{
        content: '';
        position: absolute;
        top: 0; bottom: 0;
        left: 0; right: 0;
        filter: blur(20px);
        z-index: -1;
        margin: -30px;
        background-image: url('../../assets/familyDiscipline/bg.jpg');
        background-size: cover;

    }
    .close{
        position: absolute;
        bottom: 42px;
        left: 50%;
        width: 80px;
        height: 80px;
        transform: translateX(-50%);
        cursor: pointer;
    }
}
.adai-discipline-content{
    position: absolute;
    width: calc(100% - 252px);
    top: 42px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.adai-discipline-content.active{
    justify-content: center;
}
.marginRight80{
    margin-right: 172px;
}
.adaiDiscipline_box{
    position: relative;
    width: calc(50% - 102px);
    height: 884px;
    background-color: transparent;
    padding: 8px;
    background: url('../../assets/familyDiscipline/cc.png') 0 0 repeat-x;
    background-size: auto 100%;
    display: inline-flex;
    justify-content: space-between;
    .left{
        position: absolute;
        top: 0;
        left: -46px;
        height: 900px;
    }
    .right{
        position: absolute;
        height: 900px;
        top: 0;
        right: -46px;
    }
    .adaiDiscipline_box_inner{
        padding: 36px 0;
        width: 100%;
        height: calc(100% - 72px);
    }
    .page{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 30px;
    }
    .adaiDiscipline_box_right{
        width: 100%;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        border: 1px solid #999;
        display: flex;
        justify-content: flex-start;
        flex-direction:row-reverse;
        cursor: pointer;
        li{
            min-width: 50px;
            border-right: 1px solid #999;
            color: #333;
            writing-mode:tb-rl;
            text-align: left;
            line-height: 50px;
            letter-spacing: 2px;
            padding-top: 15px;
            &:nth-of-type(1){
                border: none;
            }
            &.title{
                min-width: 100px;
                text-align: left;
                padding-top: 20px;
                h3{
                    writing-mode:tb-rl;
                    text-align: left;
                    line-height: 60px;
                }
                p{
                    color: #999;
                    width: 40px;
                    line-height: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        i{
            font-style: normal;
            color: var(--text-color);
        }
    }
}
.active{
    // animation: animate_rotate 1s ease-in-out;
}
@keyframes animate_rotate{
    from{
        opacity: 0;
        transform: rotateY(-180deg);
    }
    to{
        opacity: 1;
        transform: rotateY(0);
    }
}
.active_close{
    animation: animate_rotate_close 1s ease-in-out;
}
@keyframes animate_rotate_close{
    from{
        opacity: 1;
        transform: rotateY(0);
    }
    to{
        opacity: 0;
        transform: rotateY(-180deg);
    }
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .adaiDiscipline_box{
        position: absolute;
        top: 20px;
        right: 20px;
        bottom: 20px;
        left: 20px;
        margin: 0;
        width: auto;
        height: auto;
        .adaiDiscipline_box_inner{
            padding: 18px 16px;
            width: calc(100% - 32px);
            height: calc(100% - 36px);
        }
    }
}
</style>

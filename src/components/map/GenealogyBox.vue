<template>
    <div class="genealogybox_wrap fontSize26 PingFang_Regular">
        <router-link class="genealogybox_box" :to="'/gs?s='+surname+'&py='+pinyin+'&id='+item._key" v-for="(item,index) in genealogyList" :key="'genealogy'+index">
            <div class="genealogybox_box_cover"><i class="fontSize20">{{item.genealogyName}}</i></div>
            <h3 class="fontSize30">{{item.genealogyName}}</h3>
            <p>版本年：<span>{{item.publish}}</span></p>
            <p>谱籍地：<span>{{item.place}}</span></p>
            <p>修撰者：<span>{{item.author}}</span></p>
        </router-link>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../../utils/ADS.js";
export default {
    name: "genealogyBox",
    props:{
        
    },
    components: {
        
    },
    data: () => {
        return {
            surname:'',
            pinyin:'',
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname;
        this.pinyin = pinyin;
    },
    methods:{
        
    },
    computed: {
        ...mapState({
            genealogyList: state => state.surname.genealogyList,
        })
    },
};
</script>
<style scoped lang="scss">
.genealogybox_wrap{
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .genealogybox_box{
        display: block;
        width: 330px;
        height: 582px;
        .genealogybox_box_cover{
            position: relative;
            width: 100%;
            height: 418px;
            background: #f1f1f1 url('../../assets/cover.jpg') 50% 50% no-repeat;
            background-size: cover;
            i{
                position: absolute;
                top: 100px;
                right: 110px;
                bottom: 50px;
                font-style: normal;
                writing-mode:tb-rl;
                text-align: top;
                line-height: 20px;
                color: #fff;
                letter-spacing: 2px;
            }
        }
        h3{
            margin-top: 10px;
            color: #333;
            font-weight: normal;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        p{
            color: #999;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            span{
                &:empty{
                    &::before{
                        content: '不详';
                    }
                }
            }
        }
    }
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .genealogybox_wrap{
        .genealogybox_box{
            width: 220px;
            height: 388px;
            h3{
                font-size: 18px;
            }
            p{
                font-size: 14px;
            }
            .genealogybox_box_cover{
               height: 278px; 
               i{
                   top: 60px;
                   right: 70px;
                   bottom: 40px;
                   font-size: 12px;
                   line-height: 14px;
               }
            }
        }
    } 
}
</style>


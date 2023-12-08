<template>
    <div class="catalogbox-wrap style1">
        <router-link class="catalog" :to="'/gs?s='+surname+'&py='+pinyin+'&id='+item._key" v-for="(item,index) in list" :key="index">
            <div class="cover">
                <img src="../../assets/coverBg.png" alt="封面" />
                <i>{{item.genealogyName}}</i>
            </div>
            <div class="detail">
                <h3 class="overflow" :title="item.genealogyName">{{item.genealogyName}}</h3>
                <p>姓氏: {{item.surname}}</p>
                <p>堂号: {{item.hall}}</p>
                <p>出版年: {{item.publish}}</p>
                <p :title="item.place">谱籍地: {{item.place}}</p>
                <p class="overflow" :title="item.author">撰修者: {{item.author}}</p>
            </div>
        </router-link>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../../utils/ADS.js";
export default {
    name: "catalogbox",
    components: {
        
    },
    props:{
        list: Array,
        pinyin: String,
        surname: String
    },
    data: () => {
        return {
            
        };
    },
    created:function(){
        
    },
    mounted:function(){
        
    },
    destroyed:function(){
        
    },
    methods:{
        goCatalogDetail(data){
            this.$router.push('/gs?s='+this.surname+'&py='+this.pinyin+'&id='+data._key);
        },
    },
    computed: {
        ...mapState({
            logo: state => state.surname.logo,
            covers: state => state.surname.covers,
            province: state => state.surname.province,
            city: state => state.surname.city,
            district: state => state.surname.district,
            genealogyList: state => state.surname.genealogyList,
        })
    },
    watch:{
        
    }
};
</script>
<style scoped lang="scss">
.catalogbox-wrap{
    position: relative;
    width: 100%;
    height: calc(100% - 20px);
    font-size: 20px;
    overflow-y: auto;
    padding-bottom: 20px;
    .catalog{
        position: relative;
        height: 240px;
        width: 430px;
        color: #333;
        border: 1px solid #ddd;
        border-radius: 3px;
        display: inline-flex;
        margin: 20px 10px 0 10px;
        padding: 10px;
        .cover{
            position: relative;
            width: 190px;
            height: 240px;
            img{
                display: block;
            }
            i{
                position: absolute;
                top: 60px;
                right: 60px;
                max-height: 140px;
                font-style: normal;
                writing-mode: tb-rl;
                line-height: 14px;
                font-size: 12px;
                color: #fff;
            }
        }
        .detail{
            color: #333;
            margin-left: 20px;
            width: 200px;
            font-size: 16px;
            p{
                font-size: 16px;
                margin: 10px 0 5px 0;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>


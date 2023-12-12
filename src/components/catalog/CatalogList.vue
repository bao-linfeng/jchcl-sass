<template>
    <div class="cataloglist-wrap">
        <table class="table">
            <thead>
                <tr>
                    <th>谱ID</th>
                    <th>谱名</th>
                    <th>姓氏</th>
                    <th>堂号</th>
                    <th>出版年</th>
                    <th>谱籍地</th>
                    <th>修撰者</th>
                    <!-- <th>页数</th> -->
                    <th>影像</th>
                    <!-- <th>操作</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in list" :key="index" @click="goCatalogDetail(item)">
                    <td>{{item._key}}</td>
                    <td>{{item.genealogyName}}</td>
                    <td>{{item.surname}}</td>
                    <td>{{item.hall}}</td>
                    <td>{{item.publish}}</td>
                    <td>{{item.place}}</td>
                    <td>{{item.author}}</td>
                    <!-- <td>{{item.imageNum}}</td> -->
                    <td>{{item.hasImage ? '有' : '无'}}</td>
                    <!-- <td>
                        <button class="btn" @click="goCatalogDetail(item)">详情</button>
                    </td> -->
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../../utils/ADS.js";
export default {
    name: "catalogList",
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
.cataloglist-wrap{
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 20px;
    overflow-y: auto;
    .table{
        position: relative;
        width: 100%;
        max-height: 100%;
        text-align: center;
        thead{
            position: sticky;
            top: 0;
            left: 0;
            background-color: #fff;
            tr{
                border-bottom: 1px solid #ddd;
                th{
                    padding: 15px 0;
                    min-width: 80px;
                }
            }
        }
        tbody{
            tr{
                border-bottom: 1px solid #ddd;
                cursor: pointer;
                td{
                    padding: 15px 0;
                    min-width: 80px;
                }
            }
        }
        .btn{
            border: 1px solid #ddd;
            outline: none;
            background-color: #fff;
            color: #358acd;
            padding: 2px 5px;
            border-radius: 3px;
            cursor: pointer;
        }
    }
}
</style>


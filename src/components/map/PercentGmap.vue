<template>
    <div class="wrap">
        <div class="celebrity_nav_wrap" :class="{nav_wrap:!JiaPuStyle}">
            <img @click.stop="goBack2" src="../../assets/selectSurname/back_green.svg" alt="返回" />
            <div class="celebrity_nav_box">
                <div class="celebrity_nav_title_box">
                    <p class="h">{{surname}}氏族谱 <i class="p" v-show="JiaPuStyle">共收录了 {{genealogyList.length}} 位{{surname}}氏族谱</i></p>
                    <span class="ps">Genealogy Collection</span>
                </div>
            </div>
        </div>
        <div class="heatmap" id="heatmap" v-show="!JiaPuStyle"></div>
        <div class="genealogy_album_wrap style1" v-show="JiaPuStyle">
            <GenealogyBox />
        </div>
        <!-- <div class="colorIndex">
            <i v-for="(item,index) in rangeArr" :key="'range'+index">
                {{item}}
            </i>
        </div>
        <div class="color">
            <span :style="'background:'+item" v-for="(item,index) in colors" :key="'color'+index"></span>
        </div> -->
        <div class="percentSort">
            <div class="panbox p">
                <i class="menu_box" @click="JiaPuStyle = !JiaPuStyle"><img :src="require('../../assets/genealogy/'+(JiaPuStyle ? 'map' : 'menu')+'.svg')" alt="" /></i>
                <span>当前位置：</span>
                <span @click="insertUp({'name':'中国','adcode':'100000'})">中国</span>
                <span @click="insertUp(province_active)" v-if="province_active">> {{province_active.name}}</span>
                <span v-if="city_active" @click="insertUp(city_active)">> {{city_active.name}}</span>
                <i @click="percentBox = false" class="el-icon-close"></i>
            </div>
            <div class="countySurnameRank_wrap style1" v-show="isXian">
                <table class="countySurnameRank" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th rowspan="2">姓氏</th>
                            <th colspan="2">{{activeCounty}}</th>
                            <th colspan="2">全国</th>
                        </tr>
                        <tr>
                            <th>比例</th>
                            <th>排名</th>
                            <th>比例</th>
                            <th>排名</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in countylist" :key="'county'+index">
                            <td>{{item.surname}}</td>
                            <td>{{item.percentage}}%</td>
                            <td>{{index+1}}</td>
                            <td>{{item.countyPercent}}%</td>
                            <td>{{item.countyRank}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ul class="percentList style1 p" v-show="!isXian">
                <li v-for="(item,index) in list" :key="'place'+index" @click="insertUp(item)">
                    <span class="name">{{item.name}}</span>
                    <span class="percent">{{item.percent}}%</span>
                </li>
            </ul>
        </div>
        <p class="place_title p">{{place}} {{surname}}氏族谱收藏</p>
  </div>
</template>

<script>
import api from "../../utils/api.js";
import ADS from "../../utils/ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
import GenealogyBox from "./GenealogyBox.vue";
export default {
    name: "heatmap",
    props:{
        
    },
    components: {
        GenealogyBox,
    },
    data: () => {
        return {
            JiaPuStyle:false,
            countylist:'',
            isXian:false,
            place:'',
            map:'',
            heatmap:'',
            limit:20000,
            surname:'',
            isShow:false,
            personObj:'',
            districtExplorer:'',
            list:'',
            rangeArr:[0.04,0.08,0.12,0.16,0.20,0.24,0.28,0.32,0.36,0.40],
            max:0,
            min:100,
            adcode_active:100000,
            currentAreaNode:null,
            province_active:'',
            city_active:'',
            percentBox:false,
            city:{'北京市':'北京城区','天津市':'天津城区','上海市':'上海城区','重庆市':'重庆城区','深圳市':'深圳城区'},
            colors:['#FFF7F0','#FFEEDF','#FFE5CE','#FFD6B1','#FFC48F','#FFB16A','#FFA04A','#F68B2B','#EA6F01','#CD6100'],
            activeCounty:'',
            pinyin:'',
        };
    },
    mounted:function(){
        let search=window.location.search,params=ADS.params(search),surname=params['s'] ? decodeURIComponent(params['s']) : '',pinyin=params['py'] ? decodeURIComponent(params['py']) : '';
        // this.place = '中国';
        this.surname=surname;
        this.pinyin = pinyin;
        this.initMap();
        // this.getSurnameList(this.surname,1,true);
    },
    methods:{
        goBack2(){
            this.$router.push('/SurnameExplorer?s='+this.surname+'&py='+this.pinyin);
        },
        getSurnameGenealogy(){
            this.$store.dispatch('getSurnameGenealogy',{url:'https://home.qingtime.cn/home/gcatalog/noToken',body:{surname:this.surname,isCollect:1,isPersonDetail:0,curPage:1,perPage:5000}});
        },
        initMap(){
            //高德地图
            let map = new AMap.Map('heatmap', {
                center: [116.397428, 32.90923],
                resizeEnable: true,
                zoom:4,
                features: ['bg'],
                // mapStyle:'amap://styles/blue',
                viewMode: '2D'
            });
            let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0,-30)});//信息窗口初始化

            this.map=map;
            this.infoWindow=infoWindow;
            this.getSurnameGenealogy();
        },
        addMarker(data,isCluster){//添加点
            let self=this;
            this.map.clearMap();
            let marker,markers=[],cluster;
            if(data && data.length){//绘制点
                for(let i=0;i<data.length;i++){
                    if(data[i].location && data[i].location[0] && data[i].location[1]){
                        let div='';
                        data[i].location[0] = parseFloat(data[i].location[0])+ADS.GetRandomNum(1,9999)*0.00001;
                        data[i].location[1] = parseFloat(data[i].location[1])+ADS.GetRandomNum(1,9999)*0.00001;
                        div="<div class='adai_map_content'><div class='adai_map_content_cover'></div><div class='adai_map_content_desc fontSize26'><h3 class='fontSize30'>"+(data[i].genealogyName)+"</h3><p>版本年："+(data[i].publish ? data[i].publish : '不详')+"</p><p>谱籍地："+(data[i].place ? data[i].place : '不详')+"</p><p>修撰者："+(data[i].author || '不详')+"</p><a href='/gs?s="+this.surname+"&py="+this.pinyin+"&id="+data[i]._key+"'>查看详情</a></div></div>";
                        marker = new AMap.Marker({
                            position: data[i].location,
                            title: data[i].genealogyName,
                            map:this.map
                        });
                        //给marker绑定事件
                        marker.content=div;

                        marker.on('click', function(e){
                            self.infoWindow.setContent(e.target.content);
                            self.infoWindow.open(self.map, e.target.getPosition());
                        });
                        markers.push(marker);
                    }
                }  
                
                //点聚合
                if(isCluster){
                    if (cluster) {
                        cluster.setMap(null);
                    }
                    cluster = new AMap.MarkerClusterer(this.map, markers,{gridSize:80});
                }
            }
        },
        goback(){
            var adcode_active_str = this.adcode_active.toString();
            if(adcode_active_str.substring(2) == '0000'){//省级
                this.place = '中国';
                this.province_active = '';
                this.city_active = '';
                this.getcode('中国',100000);
            }else if(adcode_active_str == 100000){
                return false;
            }else{
                this.place = this.province_active.name;
                this.city_active = '';
                this.getcode(this.province_active,adcode_active_str.substr(0,2)+'0000');
            }
        },
        getCountySurnameRank: async function(countyCode){
            let data=await api.getAxios('https://hms.qingtime.cn/countySurnameRank?countyCode='+countyCode+'&page=0&limit=1000',true);
            if(data.status == 200){
                this.countylist = data.list;
            }
        },
        insertUp(item){//面板列表点击
            let adcode = item.adcode;
            console.log(item);
            if(adcode == '100000'){
                this.province_active = '';
                this.city_active = '';

                this.adcode_active=adcode;
                this.getcode(item.name,item.adcode);
                // this.place = '中国';
                this.percentBox = false;
                this.isXian = false;
            }else if(adcode.substring(2) == '0000'){//省级
                this.province_active = item;
                this.city_active = '';

                this.adcode_active=adcode;
                this.getcode(item.name,item.adcode);
                this.place = item.name;
                this.percentBox = false;
                this.isXian = false;
            }else if(adcode.substring(4) == '00'){//市
                this.city_active = item;

                this.adcode_active=adcode;
                this.getcode(item.name,item.adcode);
                this.place = item.name;
                // this.percentBox = false;
                this.isXian = false;
            }else{
                this.isXian = true;
                this.activeCounty = item.name;
                this.getCountySurnameRank(adcode);
            }
        },
        hideBlock(flag){
            this.isShow = flag;
        },
        getSurnameList: async function(surname,page,flag){
            let data='';
            data=await api.getAxios('https://hms.qingtime.cn/drawPicPercent?surname='+surname+'&token=82055FA47B40E3120B0FEBCAF4B9BF24',true);

            if(data.statusCode == 401){
                this.isShow = true;
                return false;
            }
            

            let person=ADS.unzip(data.result);
            person=JSON.parse(person);

            let personObj = {};
            //数据去重
            person.map((item)=>{
                if(personObj[item.areaCode]){
                    personObj[item.areaCode] = personObj[item.areaCode] + item.percentage
                }else{
                    personObj[item.areaCode] =  item.percentage
                }
            })
            //console.log(personObj)
            this.personObj = personObj;

            if(this.districtExplorer){
                this.districtExplorer.clearFeaturePolygons();
                this.getcode('中国',100000);
            }else{
                this.showDistrictExplorer();
            }
        },
        showDistrictExplorer(){
            let self = this;
            AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer, $) {
                //创建一个实例
                self.districtExplorer = window.districtExplorer = new DistrictExplorer({
                    eventSupport: true, //打开事件支持
                    map: self.map
                });

                //鼠标hover提示内容
                var $tipMarkerContent = $('<div class="tipMarker top"></div>');

                var tipMarker = new AMap.Marker({
                    content: $tipMarkerContent.get(0),
                    offset: new AMap.Pixel(0, 0),
                    bubble: true
                });

                //根据Hover状态设置相关样式
                function toggleHoverFeature(feature, isHover, position) {

                    tipMarker.setMap(isHover ? self.map : null);

                    if (!feature) {
                        return;
                    }

                    var props = feature.properties;

                    if (isHover) {
                        
                        //更新提示内容
                        if(self.personObj[props.adcode]){
                            $tipMarkerContent.html((self.personObj[props.adcode] ? (self.personObj[props.adcode] + '% : ') : '') + props.name);
                        }else{
                            $tipMarkerContent.html(props.name);
                        }
                        
                        //更新位置
                        tipMarker.setPosition(position || props.center);
                    }
                }

                //监听feature的hover事件
                districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
                    toggleHoverFeature(feature, e.type === 'featureMouseover',
                        e.originalEvent ? e.originalEvent.lnglat : null);
                });

                //监听鼠标在feature上滑动
                districtExplorer.on('featureMousemove', function(e, feature) {
                    //更新提示位置
                    tipMarker.setPosition(e.originalEvent.lnglat);
                });



                //feature被点击
                districtExplorer.on('featureClick', function(e, feature) {
                    var props = feature.properties;
                    // console.log(props);
                    //如果存在子节点
                    if (props.childrenNum > 0) {
                        if(props.level == 'province'){
                            //adcode_active=id;
                            self.province_active = {'adcode':props.adcode+'','name':props.name};
                            self.place = props.name;
                            self.getcode(props.name,props.adcode);
                        }else if(props.level == 'city'){
                            self.city_active = {'adcode':props.adcode+'','name':props.name};
                            self.place = props.name;
                            self.getcode(props.name,props.adcode);
                        }
                        //$('.goback').removeClass('hide')
                    }else{
                        if(props.level == 'district'){
                            self.isXian = true;
                            self.activeCounty = props.name;
                            self.percentBox = true;
                            self.getCountySurnameRank(props.adcode);
                        }
                    }
                });

                //外部区域被点击
                districtExplorer.on('outsideClick', function(e) {

                    districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {

                        if (routeFeatures && routeFeatures.length > 1) {
                            //切换到省级区域
                            switch2AreaNode(routeFeatures[1].properties.adcode);
                        } else {
                            //切换到全国
                            switch2AreaNode(100000);
                        }

                    }, {
                        levelLimit: 2
                    });
                });

                //全国
                if(self.personObj){
                    self.getcode('中国',100000);
                }
            });
        },
        getcode(name,id){
            let self = this;
            self.max=0;
            self.min=100;
            //行政区划查询
            var opts = {
                subdistrict: 1,   //返回下一级行政区
                showbiz:false  //最后一级返回街道信息
            };
            let district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
            district.search(self.city[name] ? self.city[name] : name, function(status, result) {
                if(status=='complete'){
                    let data = result.districtList[0].districtList;
                    //console.log(result)
                    if(data && data.length){
                        let list=[];
                        for(let i=0;i<data.length;i++){
                            let adcode=data[i].adcode;
                            if(self.personObj[adcode] > self.max){
                                self.max = self.personObj[adcode];
                            }
                            if(self.personObj[adcode] < self.min){
                                self.min = self.personObj[adcode]
                            }
                            if(self.personObj[adcode]){
                                list.push({'adcode':adcode,'level':data[i].level,'percent':self.personObj[adcode],'name':data[i].name});
                            }
                        }
                        list.sort(function(a,b){
                            return b.percent - a.percent
                        })
                        self.list = list;
                        self.createHTMLForCount();
                        self.switch2AreaNode(id);
                    }
                }
            });
        },
        switch2AreaNode(adcode, callback) {
            let self = this;
            if(adcode == 100000){

            }else{
                if (self.currentAreaNode && ('' + self.currentAreaNode.getAdcode() === '' + adcode)) {
                    return;
                }
            }
            
            this.loadAreaNode(adcode, function(error, areaNode) {

                if (error) {

                    if (callback) {
                        callback(error);
                    }

                    return;
                }

                self.adcode_active = adcode;

                self.currentAreaNode = window.currentAreaNode = areaNode;

                //设置当前使用的定位用节点
                self.districtExplorer.setAreaNodesForLocating([self.currentAreaNode]);

                self.refreshAreaNode(areaNode);

                if (callback) {
                    callback(null, areaNode);
                }
            });
        },
        loadAreaNode(adcode, callback) {
            this.districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
                if (error) {
                    if (callback) {
                        callback(error);
                    }
                    return;
                }
                if (callback) {
                    callback(null, areaNode);
                }
            });
        },
        refreshAreaNode(areaNode) {
            this.districtExplorer.setHoverFeature(null);
            this.renderAreaPolygons(areaNode);
        },
        renderAreaPolygons(areaNode) {
            let self = this;
            //更新地图视野
            if(this.adcode_active != 100000){
                this.map.setBounds(areaNode.getBounds(), null, null, true);
            }else{
                this.map.setZoom(4);
            }
            //清除已有的绘制内容
            this.districtExplorer.clearFeaturePolygons();
            //绘制子区域
            this.districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
                let properties = feature.properties;
                let adcode = properties.adcode;
                let range = 0,index=0;
                if(properties.level == 'province' || properties.level == 'city' || properties.level == 'district'){
                    range=(self.max-self.min)/10;
                }
                let fillColor = '#fff';
                if(self.personObj[adcode]){
                    if(properties.level == 'province' || properties.level == 'city' || properties.level == 'district'){
                        index = Math.round((self.personObj[adcode]-self.min)/range);
                    }
                    
                    index = index >= 10 ? 9 : index;
                    fillColor = self.colors[index];
                }
                return {
                    cursor: 'default',
                    bubble: true,
                    strokeColor: '#f2f2f2', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 1, //线宽
                    fillColor: fillColor, //填充色
                    fillOpacity: 1, //填充透明度
                };
            });

            //绘制父区域
            districtExplorer.renderParentFeature(areaNode, {
                cursor: 'default',
                bubble: true,
                strokeColor: '#ddd', //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 1, //线宽
                fillColor: null, //填充色
                fillOpacity: 0.35, //填充透明度
            });
        },
        createHTMLForCount(){//颜色梯度
            let rangeArr=[];
            let range=(this.max-this.min)/10;
            for(let j=0;j<10;j++){
                rangeArr.push((this.min+range*(j+1)).toFixed(2));
            }
            this.rangeArr = rangeArr;
        },
    },
    computed: {
        ...mapState({
            genealogyList: state => state.surname.genealogyList,
        })
    },
    watch:{
        'genealogyList':function(newV,oldV){
            this.addMarker(newV,true);
        },
    },
};
</script>
<style scoped lang="scss">
.wrap{
    position: relative;
    width: 100%;
    height: 100%;
}
.heatmap{
    width: 100%;
    height: 100%;
}
.more{
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #f2f2f2;
    z-index: 100000;
    border-radius: 3px;
    cursor: pointer;
    display: block;
    color: #333;
    font-size: 14px;
}
.avatar{
    position: absolute;
    z-index: 100000;
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
.place_title{
    position: absolute;
    top: 20px;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
    display: inline-block;
    background: rgba(255, 255, 255, 0.6);
    height: 60px;
    line-height: 60px;
    color: #666;
    padding: 0 50px;
}
.color{
    position: absolute;
    bottom: 0;
    left: 0;
    width: calc(100% - 20px);
    right: 0;
    height: 5px;
    background: #fff;
    z-index: 100000; 
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    span{
        display: block;
        width: 10%;
        height: 5px;
    }
}
.goback{
    position: fixed;
    bottom: 60px;
    right: 0;
    width: 80px;
    cursor: pointer;
    z-index: 1000000000;
}
.colorIndex{
    position: absolute;
    bottom: 10px;
    left: 0;
    width: calc(100% - 20px);
    right: 0;
    height: 15px;
    padding: 0 10px;
    background: #fff;
    z-index: 100000; 
    display: flex;
    justify-content: space-between;
    text-align: center;
    i{
        font-size: 8px;
        height: 15px;
        line-height: 15px;
        width: 10%;
        display: block;
        font-style: normal;
        overflow: hidden;
    }
    span{
        width: 15px;
        height: 8px;
        line-height: 8px;
        display: block;
        &.active{
            height: 4px;
            line-height: 4px;
        }
    }
}
.percentSort{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 400px;
    background: rgba(255,255,255,0.90);
    box-shadow: 0 4px 8px 0 rgba(124,124,124,0.65);
    z-index: 1000000;
    .panbox{
        position: relative;
        width: 400px;
        // height: 50px;
        // line-height: 50px;
        background: #f1f1f1;
        display: flex;
        flex-wrap: wrap;
        padding: 20px;
        color: #87B940;
        span{
            display: block;
            margin-right: 5px;
        }
        .menu_box{
            position: absolute;
            width: 80px;
            height: 80px;
            left: -80px;
            top: 0;
            cursor: pointer;
            border-top-left-radius: 40px;
            border-bottom-left-radius: 40px;
            background: #f1f1f1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .percentList{
        // position: absolute;
        // top: 50px;
        // right: 0;
        // bottom: 0;
        max-height: calc(100% - 90px);
        width: 100%;
        display: block;
        overflow-y: scroll;
        color: #999;
        li{
            height: 80px;
            line-height: 80px;
            display: flex;
            justify-content: space-between;
            margin: 0 20px;
            .name{
                display: block;
                width: '100px';
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .percent{
                color: #666;
            }
        }
    }
}
.menuIcon{
    position: fixed;
    top: 50%;
    right: 0px;
    z-index: 10000;
    width: 80px;
}
.countySurnameRank_wrap{
    // position: absolute;
    // top: 50px;
    // right: 0;
    // bottom: 0;
    // left: 0;
    max-height: calc(100% - 90px);
    min-height: calc(100% - 120px);
    overflow-y: auto;
}
.countySurnameRank{
    width: 100%;
    color: #999;
    border: 1px solid #999;
}
table,table tr th, table tr td {
    border: 1px solid #999;
}
th,td{
    height:40px;
    line-height:40px;
    text-align: center;
}

// 标题
.celebrity_nav_wrap{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #F9F9F9;
    display: flex;
    padding: 40px 0;
    border-bottom: 1px solid #CCCCCC;
    z-index: 100;
    img{
        width: 68px;
        height: 68px;
        cursor: pointer;
        margin: 0 20px 0 36px;
        display: block;
    }
    .celebrity_nav_box{
        width: calc(100% - 124px);
        .celebrity_nav_title_box{
            color: #333;
            span{
                color: #999;
            }
            i{
                font-style: normal;
                color: #999;
                padding-left: 20px;
                border-left: 1px solid #ccc;
                margin-left: 20px;
            }
        }
    }
}
.nav_wrap{
    background: transparent;
    border-bottom: none;
}
.genealogy_album_wrap{
    width: calc(100% - 400px);
    padding-top: 181px;
}
</style>


<template>
    <div class="GenealogyCollection_wrap fontSize30 PingFang_Regular">
        <div class="celebrity_nav_wrap" :class="{nav_wrap: true}" >
            <img @click.stop="goBack" src="../assets/selectSurname/back_green.svg" alt="返回" />
            <div class="celebrity_nav_box">
                <div class="celebrity_nav_title_box">
                    <!-- <p class="fontSize48">{{surname}}氏族谱 <i class="fontSize30" v-show="JiaPuStyle">共收录了 {{genealogyList.length}} 套{{surname}}氏族谱</i></p> -->
                    <!-- <span class="fontSize28">Genealogy Collection</span> -->
                </div>
            </div>
        </div>
        <div class="heatmap" id="heatmap"></div>
        <!-- <div class="genealogy_album_wrap style1" v-show="JiaPuStyle">
            <GenealogyBox />
        </div> -->
        <div class="toolbar_wrap">
            <!-- <img :src="require('../assets/'+(JiaPuStyle ? 'some' : 'all')+'.svg')" alt="" /> -->
            <i class="menu_box" @click="JiaPuStyle = !JiaPuStyle">{{JiaPuStyle ? '返回' : '全部'}}</i>
            <div class="toolbar_title_wrap PingFangSC_Medium">
                <span>当前位置:</span>
                <span @click="getChinaJiaPu()">中国({{total}})</span>
                <span v-if="province_active" @click="getProvinceJiaPu(province_active,provinceIndex,'province')">>{{province_active.province}}({{province_active.count}})</span>
                <span v-if="city_active">>{{city_active.city}}({{city_active.count}})</span>
            </div>
            <ul class="jiapu_place_wrap style1">
                <li v-for="(item,index) in genealogyPlaces" :key="'province'+index">
                    <p @click="getProvinceJiaPu(item,index,'province')" v-show="!province_active">{{item.province}}({{item.count}})</p>
                    <ul v-if="provinceIndex == index" class="jiapu_city_wrap">
                        <li v-for="(item2,index2) in cityArr" :key="'city'+index2">
                            <p @click="getProvinceJiaPu(item2,index2,'city')" v-show="!city_active">{{item2.city}}({{item2.count}})</p>
                            <ul v-if="cityIndex == index2" class="jiapu_list_wrap">
                                <li v-for="(item3,index3) in genealogyList" :key="'jiapu'+index3">
                                    <p @click="moveTo(item3)">{{item3.genealogyName}}</p>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    <ul v-if="province_active.province == '台湾省'" class="jiapu_list_wrap">
                        <li v-for="(item3,index3) in genealogyList" :key="'jiapu'+index3">
                            <p @click="moveTo(item3)">{{item3.genealogyName}}</p>
                        </li>
                    </ul>
                </li>
            </ul>
            <!-- <div class="fs-box">
                <img class="logo" src="../assets/FS.svg" alt="">
                <img class="ewm" src="../assets/fs_ewm.png" alt="">
                <p>FamilySearch拥有世界上最大的在线家谱库，此处仅仅展示了一小部分家谱，如果未查询到您的家谱，您可以访问网站<a href="https://familysearch.org" target="_blank">www.familysearch.org</a>，免费查阅。</p>
            </div> -->
        </div>
        <p class="place_title">{{province_active ? province_active.province : ''}}{{city_active ? city_active.city : ''}} {{!JiaPuStyle ? surname+(surO[surname] ? '('+surO[surname]+')' : '')+'氏' : ''}}族谱收藏</p>
    </div>
</template>

<script>
import GenealogyBox from "../components/map/GenealogyBox.vue";
import ADS from "../utils/ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "GenealogyCollection",
    components: {
        GenealogyBox
    },
    data: () => {
        return {
            blob:'',
            provinceIndex:-1,
            province_active:'',
            city_active:'',
            cityIndex:-1,
            jiapuIndex:-1,
            pinyin:'',
            surname:'',
            JiaPuStyle:false,
            infoWindow:'',
            map:'',
            place:'',
            colors:["#f3f9e9", "#e0efc8", "#cbe4a5", "#b7da81", "#a6d164", "#96c948", "#87b940", "#72a536", "#5e912d", "#3b6f1b"],
            isFirst:true,
            genealogyPlaces:[],
            cityObj:{},
            cityArr:[],
            provinceO:{
                650000:"新疆维吾尔自治区",
                630000:"青海省",
                540000:"西藏自治区",
                620000:"甘肃省",
                150000:"内蒙古自治区",
                230000:"黑龙江省",
                210000:"辽宁省",
                130000:"河北省",
                110000:"北京市",
                220000:"吉林省",
                420000:"湖北省",
                450000:"广西壮族自治区",
                500000:"重庆市",
                510000:"四川省",
                410000:"河南省",
                430000:"湖南省",
                530000:"云南省",
                140000:"山西省",
                640000:"宁夏回族自治区",
                520000:"贵州省",
                610000:"陕西省",
                440000:"广东省",
                350000:"福建省",
                810000:"香港特别行政区",
                330000:"浙江省",
                370000:"山东省",
                120000:"天津市",
                710000:"台湾省",
                340000:"安徽省",
                360000:"江西省",
                320000:"江苏省",
                310000:"上海市",
                820000:"澳门特别行政区",
            },
            startTime: 0,
            cityObjO:{},
            total: 0,
            pointSimplifierIns: '',
            isPoint: false,
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search),surname=param['s'] ? decodeURIComponent(param['s']) : '',pinyin=param['py'] ? decodeURIComponent(param['py']) : '';
        this.surname = surname;
        this.pinyin = pinyin;
        this.place = '中国';
        this.startTime = Date.now();
    },
    mounted:function(){
        this.initMap();
    },
    destroyed:function(){
      this.clickNum('姓氏族谱', 'L1', Date.now() - this.startTime)
    },
    methods:{
        async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        getChinaJiaPu(){
            this.provinceIndex=-1;
            this.province_active = '';
            this.city_active = '';
            this.cityIndex = -1;
            this.jiapuIndex = -1;
            this.place = '中国';
            this.map.panTo([104.341211,35.086148]);
            this.map.setZoom(5);
            this.initDistrictSearch(this.place);
            // this.map.setCity(this.place);
            this.getSurnameGenealogy();
        },
        getProvinceJiaPu(item,index,type){
            console.log(item,index,type);
            this[type+'_active'] = item;
            this.place = item[type];
            this[type+'Index'] = index;
            this.map.setCity(this.place);
            this.getSurnameGenealogy();
            if(type == 'province'){
                this.cityIndex = -1;
                this.city_active = '';
                this.initDistrictSearch(this.place);
                this.initJiapuCity(item[type]);
            }
        },
        goBack(){
            this.$router.push('/SurnameExplorer?s='+this.surname+'&py='+this.pinyin);
        },
        getSurnameGenealogy(){
            this.$store.dispatch('changePropertyValue',{'property': 'genealogyList', 'value': []});
            this.$store.dispatch('getSurnameGenealogy',{url:'https://gtdata.qingtime.cn/catalogSimple',body:{surname: this.JiaPuStyle ? '' : this.surname,hasImage:'',place: this.place}});
        },
        initMap(){
            //高德地图
            var citys=[],disCountry = new AMap.DistrictLayer.Country({
                zIndex:10,
                SOC:'CHN',
                depth:2,
                styles:{
                    'nation-stroke':'rgba(255,255,255,1)',
                    'coastline-stroke':'rgba(255,255,255,1)',
                    'province-stroke':'rgba(0,0,0,1)',
                    'city-stroke': 'rgba(255,255,255,0.3)',//中国特有字段
                    'fill':(props) => {//中国特有字段
                        // console.log(props);
                        return '#5CB483'
                    }
                }
            })

            let map = new AMap.Map('heatmap', {
                center: [104.341211,35.086148],
                resizeEnable: true,
                zoom:5,
                features: ['bg'],
                // mapStyle:'amap://styles/blue',
                viewMode: '2D',
                layers:[
                    disCountry
                ],
                // touchZoom:false,
            });
            let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0,-30)});//信息窗口初始化
            this.layer = new AMap.LabelsLayer({collision: false,animation: true,zIndex: 11});

            map.on('click',  (ev) => {
                var props = disCountry.getDistrictByContainerPos(ev.pixel),index=-1,count=0;// 拾取所在位置的行政区
                let timer = setTimeout(() => {
                    if(this.isPoint){
                        this.isPoint = false;
                        return;
                    }
                    if(this.province_active){
                        this.cityArr.map((item,key)=>{
                            if(item.city == props.NAME_CHN){
                                count = item.count;
                                index = key;
                            }
                        });
                        index > -1 ? this.getProvinceJiaPu({'count':count,'city':props.NAME_CHN},index,'city') : ADS.message(props.NAME_CHN+'暂无家谱');
                    }else{
                        this.genealogyPlaces.map((item,key)=>{
                            if(item.province == this.provinceO[props.adcode_pro]){
                                count = item.count;
                                index = key;
                            }
                        });
                        index > -1 ? this.getProvinceJiaPu({'count':count,'province':this.provinceO[props.adcode_pro]},index,'province') : ADS.message(this.provinceO[props.adcode_pro]+'暂无家谱');
                    }
                    clearTimeout(timer);
                    timer = '';
                },200);
            });

            AMap.plugin([
                'AMap.ToolBar',
            ], function(){
                // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
                map.addControl(new AMap.ToolBar({position:'LB'}));
            });

            this.initDistrictSearch('中国');
            this.map=map;
            this.infoWindow=infoWindow;
            this.getSurnameGenealogy();
        }, 
        initDistrictSearch(place){//行政区划查询
            this.layer ? this.layer.clear() : null;
            var opts = {
                subdistrict: 1,   //返回下一级行政区
                showbiz:false  //最后一级返回街道信息
            };
            let district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
            district.search(place, (status, result) => {
                if(status=='complete'){
                    // console.log(result.districtList[0].districtList);
                    this.initLabelsLayer(result.districtList[0].districtList)
                }
            });
        },
        initLabelsLayer(districts){//添加标签
            var labelsMarker,district,config;
            for (let i = 0; i < districts.length; i++) {
                config = {
                    name: '',
                    position: [116.12, 39.11],
                    zooms: [4, 13],
                    zIndex: 1,
                    opacity: 1,
                    text: {
                        content: '',
                        direction: 'center',
                        offset: [0, 0],
                        zooms: [3, 20],
                        style: {
                            fontSize: 14,
                            fontWeight: 'normal',
                            fillColor: '#333',
                            strokeColor: '#fff',
                            strokeWidth: 0,
                        }
                    }
                };
                district = districts[i];
                config.text.content = district.name;
                config.position = [district.center.lng,district.center.lat];
                labelsMarker = new AMap.LabelMarker(config);
                this.layer.add(labelsMarker);
            }
            this.map.add(this.layer);
        },
        moveTo(item, falg = true){
            let div="<div class='adai_map_content'><div class='adai_map_content_cover'><i>"+item.genealogyName+"</i></div><div class='adai_map_content_desc fontSize26'><h3 class='fontSize30'>"+(item.genealogyName)+"</h3><p>版本年："+(item.publish ? item.publish : '不详')+"</p><p>谱籍地："+(item.place ? item.place : '不详')+"</p><p>修撰者："+(item.author || '不详')+"</p><a href='/gs?s="+this.surname+"&py="+this.pinyin+"&id="+item._key+"'>查看详情</a></div></div>";
            falg ? this.map.panTo(item.location) : null;
            this.infoWindow.setContent(div);
            this.infoWindow.open(this.map, item.location);
        },
        addMarker(data,isCluster){//添加点
            this.map ? this.map.clearMap() : null;
            this.pointSimplifierIns ? this.pointSimplifierIns.setData([]) : null;
            let marker,markers=[],lat,lang,massMarksData = [];

            if(data && data.length){//绘制点
                for(let i=0;i<data.length;i++){
                    if(data[i].location && data[i].location[0] && data[i].location[1]){
                        lat = parseFloat(data[i].location[0])+ADS.GetRandomNum(1,100)*0.00001;
                        lang = parseFloat(data[i].location[1])+ADS.GetRandomNum(1,100)*0.00001;
                        data[i].location = [lang, lat];
                        if(isCluster){
                            massMarksData.push({'position': [lang, lat],'name': data[i].genealogyName,'info': data[i]});
                        }else{
                            marker = new AMap.Marker({
                                position: data[i].location,
                                title: data[i].genealogyName,
                                map: this.map
                            });
                            marker.content = data[i];
                            marker.on('click', (e) => {
                                this.moveTo(e.target.content);
                            });
                            markers.push(marker);
                        }
                    }
                }  
                
                // 点聚合
                if(isCluster){
                    this.initPointSimplifier(massMarksData);
                }else{
                    this.map.add(markers);
                }
            }
        },
        initPointSimplifier(pointData){
            if(this.pointSimplifierIns){
                this.pointSimplifierIns.setData(pointData);
            }else{
                AMapUI.loadUI(['misc/PointSimplifier'], (PointSimplifier) => {
                    if (!PointSimplifier.supportCanvas) {
                        alert('当前环境不支持 Canvas！');
                        return;
                    }
                    //创建组件实例
                    var pointSimplifierIns = new PointSimplifier({
                        map: this.map,
                        data: pointData,
                        zIndex: 300,
                        autoSetFitView: false,
                        compareDataItem: function(a, b, aIndex, bIndex) {
                            //数据源中靠后的元素优先，index大的排到前面去
                            return aIndex > bIndex ? -1 : 1;
                        },
                        getPosition: function(dataItem) {
                            return dataItem.position;
                        },
                        getHoverTitle: function(dataItem, idx) {
                            return dataItem.name;
                        },
                        renderOptions: {
                            pointStyle: {
                                fillStyle: '#358acd'
                            }
                        }
                    });

                    this.pointSimplifierIns = pointSimplifierIns

                    //监听事件
                    pointSimplifierIns.on('pointClick', (e, record) => {
                        this.isPoint = true;
                        record.data.info.location = record.data.position;
                        this.moveTo(record.data.info);
                    });
                });
            }
        },
        initJiapuProvince(genealogyList){
            let genealogyObj={},cityObj={},genealogyPlaces=[],cityArr=[],start = Date.now();
            genealogyList.map((item)=>{
                if(item.city == '无'){
                    item.city = item.province+'其他'
                }
                if(item.province){
                    if(genealogyObj[item.province]){
                        genealogyObj[item.province] = genealogyObj[item.province] + 1;
                    }else{
                        genealogyObj[item.province] = 1;
                    }
                }
                if(item.city && item.city != '无'){
                    if(cityObj[item.province+item.city]){
                        cityObj[item.province+item.city] = cityObj[item.province+item.city] + 1;
                    }else{
                        cityObj[item.province+item.city] = 1;
                    }
                }
            });
            for(let key in genealogyObj){
                genealogyPlaces.push({province:key,count:genealogyObj[key]});
            }
            
            genealogyPlaces.sort(function(a,b){return b.count - a.count});
            // console.log(Date.now() - start);
            this.genealogyPlaces = genealogyPlaces;
            this.cityObj = cityObj;
        },
        initJiapuCity(type){
            let cityArr = [];
            for(let key in this.cityObj){
                if(key.indexOf(type) > -1){
                    cityArr.push({city:key.replace(type,''),count:this.cityObj[key]});
                }
            }
            cityArr.sort(function(a,b){return b.count - a.count});
            this.cityArr = cityArr;
        },
    },
    computed: {
        ...mapState({
            genealogyList: state => state.surname.genealogyList,
            surO: state => state.surname.surO,
            // genealogyPlaces: state => state.surname.genealogyPlaces,
        })
    },
    watch:{
        'genealogyList':function(newV,oldV){
            // console.log(newV);
            this.addMarker(newV,this.JiaPuStyle ? true : false);
            if(newV && newV.length && this.isFirst){
                this.isFirst = false;
                this.initJiapuProvince(newV);
                this.total = newV.length;
            }
        },
        'JiaPuStyle': function(nv,ov){
            // console.log(nv);
            this.isFirst = true;
            // this.getSurnameGenealogy();
            this.getChinaJiaPu();
        },
    },
};
</script>
<style scoped lang="scss">
.GenealogyCollection_wrap{
    position: relative;
    width: 100%;
    height: 100%;
}
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
.heatmap{
    width: calc(100% - 440px);
    height: 100%;
}
.genealogy_album_wrap{
    width: calc(100% - 440px);
    padding-top: 181px;
}
.place_title{
    position: absolute;
    top: 40px;
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
.toolbar_wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 440px;
    background: rgba(255,255,255,0.90);
    // border: 1px solid #A67C52;
    box-shadow: 0 4px 8px 0 rgba(114,68,21,0.62);
    // display: flex;
    // flex-wrap: wrap;
    // padding: 20px;
    color: #5CB483;
    z-index: 10000;
    .toolbar_title_wrap{
        position: relative;
        top: -1px;
        background: #f1f1f1;
        display: flex;
        flex-wrap: wrap;
        padding: 20px;
        color: #5CB483;
        span{
            display: block;
            margin-right: 5px;
            cursor: pointer;
        }
    }
    .jiapu_place_wrap{
        max-height: calc(100% - 95px);
        height: calc(100% - 85px);
        width: 100%;
        display: block;
        overflow-y: auto;
        color: #666;
        >li{
            text-indent: 20px;
            cursor: pointer;
            p{
                height: 80px;
                line-height: 80px;
            }
        }
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
        box-shadow: 0 4px 8px 0 rgba(114,68,21,0.62);
        font-weight: bold;
    }
}
.jiapu_city_wrap{
    li{
        // text-indent: 40px;
    }
}
.jiapu_list_wrap{
    li{
        // text-indent: 60px;
        p{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
.fs-box{
    position: absolute;
    left: 0;
    width: calc(100% - 60px);
    height: 180px;
    bottom: 0;
    box-shadow: 0 4px 8px 0 rgba(114,68,21,0.62);
    padding: 20px 30px 0 30px;
    font-size: 18px;
    color: #666;
    background: #fff;
    .logo{
        height: 60px;
    }
    .ewm{
        position: absolute;
        top: 20px;
        right: 30px;
        height: 60px;
        display: none;
    }
    a{
        color: #666;
        cursor: pointer;
    }
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .heatmap{
        width: calc(100% - 280px);
    }
    .celebrity_nav_wrap{
        padding: 24px 0;
        font-size: 18px;
        img{
            width: 42px;
            height: 42px;
        }
        .celebrity_nav_title_box{
            p{
                font-size: 30px;
            }
            span{
                font-size: 18px;
            }
        }
    }
    .toolbar_wrap{
        width: 280px;
        font-size: 18px;
        .menu_box{
            width: 50px;
            height: 50px;
            left: -50px;
            border-top-left-radius:25px;
            border-bottom-left-radius:25px;
            img{
                width: 32px;
                height: 32px;
            }
        }
        .toolbar_title_wrap{
            padding: 12px;
        }
        .jiapu_place_wrap{
            >li{
                p{
                    height: 48px;
                    line-height: 48px;
                }
            }
        } 
    }
    .genealogy_album_wrap{
        padding-top: 118px;
        width: calc(100% - 280px);
    }
}
</style>


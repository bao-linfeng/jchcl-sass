<template>
    <div class="wrap">
        <div class="heatmap" id="heatmap"></div>
        <!-- <div class="colorIndex">
            <i v-for="(item,index) in rangeArr" :key="'range'+index">
                {{item}}
            </i>
        </div>-->
        <!-- <div class="color">
            <span :style="'background:'+item" v-for="(item,index) in colors" :key="'color'+index"></span>
        </div>  -->
        <div class="percentSort fontSize30 ">
            <div class="panbox PingFangSC_Medium">
                <span @click="getSurnamePer(1,'','',100000)">中国</span>
                <span @click="getSurnamePer('',province_active.adcode,'',province_active.adcode)" v-if="province_active">> {{province_active.name}}</span>
                <span @click="getSurnamePer('','',city_active.adcode,city_active.adcode)" v-if="city_active">> {{city_active.name}}</span>
                <i @click="percentBox = false" class="el-icon-close"></i>
            </div>
            <!-- <div class="countySurnameRank_wrap style1" v-show="isXian">
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
            </div> -->
            <ul class="percentList style1 PingFang_Regular">
                <li v-for="(item,index) in list" :key="'place'+index" :id="item.areaCode" @click="insertUpCounty(item)" :class="{active:item.areaCode == activeAdcode}">
                    <span class="name">{{item.areaName}}</span>
                    <span class="percent">{{item.percentage}}%</span>
                </li>
            </ul>
            <!-- <div class="fs-box">
                <img src="../../assets/FS.svg" alt="">
                <p>FamilySearch拥有世界上最大的在线家谱库，您可以访问网站<a href="https://familysearch.org" target="_blank">www.familysearch.org</a>，免费查阅家谱。</p>
            </div> -->
        </div>
        <img class="menuIcon" @click="percentBox=true" src="../../assets/menu2.png" alt="目录" />
        <!-- <img class="goback" v-show="adcode_active != 100000" @click="goback" src="../../assets/back.svg" alt="返回上一级" /> -->
        <p class="place_title fontSize30 PingFang_Regular">{{province_active ? province_active.name : ''}}{{city_active ? city_active.name : ''}} {{surname}}{{surO[surname] ? '('+surO[surname]+')' : ''}}氏后裔分布</p>
        <AdaiLoadCard :surname="surname+(surO[surname] ? '('+surO[surname]+')' : '')" v-if="loading && surname" v-on:close-loading="closeLoading" />
  </div>
</template>

<script>
import api from "../../utils/api.js";
import ADS from "../../utils/ADS.js";
import AdaiLoadCard from "../adai/AdaiLoadCard.vue";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "heatmap",
    props:{
        isLight:{
            type:[Boolean],
            default:false
        },
        type:{
            type:[Boolean],
            default:false
        },
        redirect:{
            type:[String],
            default:'/surnameList'
        },
        menuShow:{
            type:[Boolean],
            default:false
        },
    },
    components: {
        AdaiLoadCard,
    },
    data: () => {
        return {
            activeAdcode:'',
            loading:true,
            countylist:'',
            isXian:false,
            place:'',
            flag:false,
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
            colors:["#f3f9e9", "#e0efc8", "#cbe4a5", "#b7da81", "#a6d164", "#96c948", "#87b940", "#72a536", "#5e912d", "#3b6f1b"],
            activeCounty:'',
            colorIndex:{},
            tipMarker:'',
            $tipMarkerContent:'',
            startTime: 0,
        };
    },
    mounted:function(){
        let search=window.location.search,params=ADS.params(search),surname=params['s'] ? decodeURIComponent(params['s']) : '';

        this.place = '中国';
        this.surname=surname;
        this.initMap();
        this.startTime = Date.now();
    },
    destroyed:function(){
      this.clickNum('后裔分布', 'L1', Date.now() - this.startTime)
    },
    methods:{
        async clickNum(name, type, useTime){
            let res = await ADS.AdaiXHR('https://home.qingtime.cn/surname/surname/module/clickNum',{'type': type,'name': name,'useTime': useTime},'POST',true);
        },
        closeLoading(){
            this.loading = false;
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
                this.place = '中国';
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
                ADS.message('已经最后一层了');
            }
        },
        hideBlock(flag){
            this.isShow = flag;
        },
        initMap(){
            //高德地图
            let map = new AMap.Map('heatmap', {
                center: [116.397428, 32.90923],
                resizeEnable: true,
                zoom:5,
                features: ['bg'],
                // mapStyle:'amap://styles/blue',
                viewMode: '2D',
                // touchZoom:false,
            });
            this.map=map;
            AMap.plugin([
                'AMap.ToolBar',
            ], function(){
                // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
                map.addControl(new AMap.ToolBar({position:'LB'}));
            });
            this.getSurnamePer(1,'','',100000);
        },
        scrollIntoView(i){
            this.$nextTick( () => {
                document.getElementById(i).scrollIntoView({inline:'center'});            
            })
        },
        getLocationByAddress(address,item){
            fetch('https://restapi.amap.com/v3/geocode/geo?address='+address+'&output=JSON&key=09133c37197fa78480373c8ac19ac853&batch=true').then(response => response.json())
            .then(data => {
                //   console.log(data);
                let location = data.geocodes && data.geocodes[0].location;
                this.map.panTo(location.split(','));

                this.tipMarker.setMap(this.map);
                let title = '',name=item.areaName,nameW=name.length,percentage = item.percentage,percentageW = ((percentage+'').length)*12+12;
                title = "<div class='adai_map_title drop_shadow'><div class='adai_map_title_in'><span class='adai_map_name' style='width:"+nameW*20+"px'>"+name+"</span><span class='adai_map_percentage' style='width:"+percentageW+"px'>"+percentage+"%</span></div></div>"
                this.$tipMarkerContent.html(title);
                this.tipMarker.setPosition(location.split(','));
            }).catch(e => console.log("Oops, error", e))
        },
        insertUpCounty(item){
            // console.log(item);
            let adcode = item.areaCode,address='';
            if(item.level == 1){
                this.city_active = {adcode:adcode,name:item.areaName};
                this.place = item.areaName;
                this.getSurnamePer('','',adcode,adcode);
            }else if(item.level == 2){
                address=(this.province_active ? this.province_active.name : '')+(this.city_active ? this.city_active.name : '')+item.areaName
                this.getLocationByAddress(address,item);
                this.activeAdcode = item.areaCode;
                // this.scrollIntoView(item.areaCode);
                ADS.message('已经最后一层了');
            }else{
                this.province_active = {adcode:adcode,name:item.areaName};
                this.place = item.areaName;
                this.getSurnamePer('',adcode,'',adcode);
            }
        },
        async getSurnamePer(percentType,provinceCode,cityCode,adcode){
            if(percentType == 1){
                this.province_active = '';
                this.city_active = '';
                this.place = '中国';
            }
            if(provinceCode){
                this.city_active = '';
                this.place = provinceCode.name;
            }
            
            let data=await api.getAxios('https://hms.qingtime.cn/getPercent?surname='+this.surname+'&percentType='+percentType+'&provinceCode='+provinceCode+'&cityCode='+cityCode,true);
            this.list = data.result;
            this.initPercent(this.list,adcode);
        },
        initPercent(data,adcode){
            if(adcode == '820000' || adcode == '710000' || adcode == '810000'){
                this.map.setCity(adcode, () => {
                    this.map.setZoom(adcode == '820000' ? 11 : adcode == '710000' ? 7 : 10);
                });
                // var geocoder = new AMap.Geocoder({});
                // geocoder.getLocation(this.province_active.name, function(status, result) {
                //     if (status === 'complete' && result.info === 'OK') {
                //         console.log(result);
                //     }
                // })
            }
            if(!data.length){ADS.message('已经最后一层了');return}
			let l = data.length,max = data[0].percentage,min = data[l-1].percentage,colorIndex={},range = 0,index=0,percentage=0;

			range=(max-min)/10;
			for(let i = 0;i< l;i++){
				percentage = data[i].percentage;
				index = Math.round((percentage-min)/range);
			    index = index >= 10 ? 9 : index;
				colorIndex[data[i].areaCode] = {percentage:data[i].percentage,color:this.colors[index]};
			}
            this.colorIndex = colorIndex;
            if(this.districtExplorer){
                this.districtExplorer.clearFeaturePolygons();
                this.switch2AreaNode(adcode);
            }else{
                this.DistrictExplorer();
            }
        },
        DistrictExplorer(){
            let self = this;
            AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], (DistrictExplorer, $) => {
                //创建一个实例
                this.districtExplorer = window.districtExplorer = new DistrictExplorer({
                    eventSupport: true, //打开事件支持
                    map: this.map
                });

                //鼠标hover提示内容
                this.$tipMarkerContent = $('<div class="tipMarker bottom"></div>');
                var tipMarker = new AMap.Marker({
                    content: this.$tipMarkerContent.get(0),
                    offset: new AMap.Pixel(-38, -60),
                    bubble: true
                });
                this.tipMarker = tipMarker;
                //根据Hover状态设置相关样式
                function toggleHoverFeature(feature, isHover, position) {
                    tipMarker.setMap(isHover ? self.map : null);
                    if (!feature) {
                        return;
                    }
                    var props = feature.properties;
                    if (isHover) {
                        //更新提示内容
                        if(self.colorIndex[props.adcode]){
                            let title = '',nameW=(props.name).length,percentage = self.colorIndex[props.adcode].percentage,percentageW = ((percentage+'').length)*12+12;
                            title = "<div class='adai_map_title drop_shadow'><div class='adai_map_title_in'><span class='adai_map_name' style='width:"+nameW*20+"px'>"+props.name+"</span><span class='adai_map_percentage' style='width:"+percentageW+"px'>"+percentage+"%</span></div></div>"
                            self.$tipMarkerContent.html(title);
                            // $tipMarkerContent.html(self.colorIndex[props.adcode].percentage + '%' + props.name);
                        }else{
                            // self.$tipMarkerContent.html(props.name);
                        }
                        
                        //更新位置
                        // tipMarker.setPosition(position || props.center);
                        tipMarker.setPosition(props.center);
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
                districtExplorer.on('featureClick', (e, feature) => {
                    var props = feature.properties;
                    console.log(props);
                    //如果存在子节点
                    if (props.childrenNum > 0) {
                        if(props.level == 'province'){
                            this.province_active = {'adcode':props.adcode+'','name':props.name};
                            this.place = props.name;
                            this.getSurnamePer('',props.adcode,'',props.adcode);
                        }else if(props.level == 'city'){
                            this.city_active = {'adcode':props.adcode+'','name':props.name};
                            this.place = props.name;
                            this.getSurnamePer('','',props.adcode,props.adcode);
                        }
                    }else{
                        if(props.level == 'district'){
                            this.activeAdcode = props.adcode;
                            this.scrollIntoView(props.adcode);
                            ADS.message('已经最后一层了');
                        }
                    }
                });

                //外部区域被点击
                // districtExplorer.on('outsideClick', function(e) {

                //     districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {

                //         if (routeFeatures && routeFeatures.length > 1) {
                //             //切换到省级区域
                //             self.switch2AreaNode(routeFeatures[1].properties.adcode);
                //         } else {
                //             //切换到全国
                //             self.switch2AreaNode(100000);
                //         }

                //     }, {
                //         levelLimit: 2
                //     });
                // });

                this.switch2AreaNode(100000);
            });
        },
        getSurnameList: async function(surname,page,flag){
            let data='';
            // data=await api.getAxios('https://hms.qingtime.cn/drawPicPercent?surname='+surname+'&token=82055FA47B40E3120B0FEBCAF4B9BF24',true);
            data=await api.getAxios('https://hms.qingtime.cn/drawPicPercentTest?surname='+surname,true);

            if(data.statusCode == 401){
                this.isShow = true;
                return false;
            }
            // this.loading = true;
            // let person=ADS.unzip(data.result);
            // person=JSON.parse(person);
            let person = data.result;
            // console.log(Date.now());
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
            // console.log(Date.now());
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
                var $tipMarkerContent = $('<div class="tipMarker bottom"></div>');
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
                            let title = '';
                            title = "<div class='adai_map_title'><span class='adai_map_name'>"+props.name+"</span><span>"+(self.personObj[props.adcode] ? (self.personObj[props.adcode] + '% : ') : '')+"</span></div>"
                            $tipMarkerContent.html(title);
                        }else{
                            // $tipMarkerContent.html(props.name);
                        }
                        
                        //更新位置
                        // tipMarker.setPosition(position || props.center);
                        tipMarker.setPosition(props.center);
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
                            ADS.message('已经最后一层了');
                        }
                    }
                });

                //外部区域被点击
                // districtExplorer.on('outsideClick', function(e) {

                //     districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {

                //         if (routeFeatures && routeFeatures.length > 1) {
                //             //切换到省级区域
                //             self.switch2AreaNode(routeFeatures[1].properties.adcode);
                //         } else {
                //             //切换到全国
                //             self.switch2AreaNode(100000);
                //         }

                //     }, {
                //         levelLimit: 2
                //     });
                // });

                // self.switch2AreaNode(100000);
                //全国
                if(self.personObj){
                    self.getcode('中国',100000);
                }
            });
        },
        getcode(name,id){
            console.log(Date.now());
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
                    console.log(data);
                    //console.log(result)
                    if(data && data.length){
                        // console.log(Date.now());
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
                        // console.log(Date.now());
                        list.sort(function(a,b){
                            return b.percent - a.percent
                        })
                        // console.log(Date.now());
                        self.list = list;
                        self.createHTMLForCount();
                        self.switch2AreaNode(id);
                    }
                }
            });
        },
        switch2AreaNode(adcode, callback) {
            let self = this;
            this.loadAreaNode(adcode, (error, areaNode) => {

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

                    console.error(error);

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
            //更新地图视野
            if(this.adcode_active != 100000){
                this.map.setBounds(areaNode.getBounds(), null, null, true);
            }else{
                this.map.setZoom(4);
            }
        
            //清除已有的绘制内容
            this.districtExplorer.clearFeaturePolygons();
            //绘制子区域
            this.districtExplorer.renderSubFeatures(areaNode, (feature, i) => {
                // console.log(feature.properties);
                return {
                    cursor: 'default',
                    bubble: true,
                    strokeColor: '#aaa', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 1, //线宽
                    fillColor: (this.colorIndex[feature.properties.adcode] ? this.colorIndex[feature.properties.adcode]['color'] : this.colors[0]), //填充色
                    fillOpacity: 1, //填充透明度
                };
            });
            //绘制父区域
            districtExplorer.renderParentFeature(areaNode, {
                cursor: 'default',
                bubble: true,
                strokeColor: '#bbb', //线颜色
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
            surnameSortList: state => state.surname.surnameSortList,
            surnameSortPages: state => state.surname.surnameSortPages,
            surnameTotal: state => state.surname.surnameTotal,
            surnameTotalArr: state => state.surname.surnameTotalArr,
            surO: state => state.surname.surO,
        })
    },
    watch:{
        '$route':function(to,from){
            // console.log(to, from);
            if(to.name == 'ProgenyDistribution'){
                this.tipMarker ? this.tipMarker.setMap(null) : null;
            }
            if(to.name == 'ProgenyDistribution' && to.query.s != this.surname){
                this.place = '中国';
                this.surname=to.query.s;
                this.loading = true;
                this.getSurnamePer(1,'','',100000);
            }
            if(to.name == 'ProgenyDistribution' && from.name == 'SurnameExplorer'){
                this.startTime = Date.now();
            }
            if(to.name == 'SurnameExplorer' && from.name == 'ProgenyDistribution'){
                this.clickNum('后裔分布', 'L1', Date.now() - this.startTime)
            }
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
    // border: 1px solid #A67C52;
    box-shadow: 0 4px 8px 0 rgba(114,68,21,0.62);
    z-index: 1000000;
    .panbox{
        position: relative;
        // height: 50px;
        // line-height: 50px;
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
        i{
            position: absolute;
            right: 10px;
            top: 10px;
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
        color: #666;
        li{
            height: 80px;
            line-height: 80px;
            display: flex;
            justify-content: space-between;
            margin: 0 20px;
            cursor: pointer;
            &.active{
                color: #5CB483;
            }
            .name{
                display: block;
                width: '100px';
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            // .percent{
            //     color: #666;
            // }
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
.fs-box{
    position: absolute;
    left: 0;
    width: calc(100% - 80px);
    height: 240px;
    bottom: 0;
    box-shadow: 0 4px 8px 0 rgba(114,68,21,0.62);
    padding: 0 40px;
    font-size: 24px;
    color: #666;
    img{
        margin-top: 20px;
        height: 60px;
    }
    a{
        color: #666;
        cursor: pointer;
    }
}
@media screen and (max-width: 1366px) and (min-width: 1050px){
    .percentSort{
        width: 280px;
        font-size: 18px;
        .panbox{
            padding: 12px 20px;
        }
        .percentList li{
            height: 48px;
            line-height: 48px;
        }
    }
}
</style>


import ADS from "../utils/ADS.js";
const state = {
    surnames:[],
    surnameDetail:'',
    surnameTotal:{'ZH':'','EN':''},
    surnameTotalArr:[],
    surnameSortList:[],
    surnameSortPages:0,
    genealogyList:[],
    genealogyPlaces:[{province:'江苏省',count:5,citys:[{city:'常州市',count:2},{city:'南京市',count:3}]},{province:'安徽省',count:2}],
    genealogySummary:{},
    genealogyViews:[],
    genealogyViewTotal:0,
    familyDisciplineList:[],
    familyDisciplineDetail:{'content':''},
    celebrityLabelList:[],
    celebrityList:[],
    celebrityPages: 0,
    celebrityTotal:0,
    celebrityDynastyList:[],
    celebrityProfile:{'remark':''},
    celebrityAllTotal:0,
    checkDatas:{
        hasBaiKe: 1,
        hasCata: 1,
        hasCele: 1,
        hasDistr: 1,
        hasPop: 1,
        hasRule: 1
    },
    surO:{'肖':'萧','萧':'肖','付':'傅','傅':'付','闫':'阎','阎':'闫'}, // , '于': '於', '於': '于'
    surOS:{'肖':'肖','萧':'肖','付': '付','傅': '付','闫': '闫','阎': '闫'}, // , '于': '于', '於': '于'
    surSummary: '',
    domain: ADS.getLocalStorage('domain') || '',
    logo: '',
    covers: [],
    surname: ADS.getLocalStorage('surname') || '',
    pinyin: ADS.getLocalStorage('pinyin') || '',
    province: ADS.getLocalStorage('province') || '',
    city: ADS.getLocalStorage('city') || '',
    district: ADS.getLocalStorage('district') || '',
    pageNum: ADS.getLocalStorage('pageNum') || '',
    genealogySurnameList: [],
    title: '家文化探索中心',
    customName: '',
    catalogSource: '1',
}

const actions = {
    changePropertyValue({ commit }, data){
        commit('CHANGEPROPERTYVALUE', data)
    },
    async getCelebrityProfile({ commit }, data){//名人简介
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETCELEBRITYPROFILE', result);
    },
    async getCelebrityDynasty({ commit }, data){//名人列表
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETCELEBRITYDYNASTY', result);
    },
    async getCelebrityList({ commit }, data){//名人列表
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETCELEBRITYLIST', result);
    },
    async getCelebrityLabel({ commit }, data){//名人标签
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETCELEBRITYLABEL', result);
    },
    async getSurnameList({ commit }, data){//姓氏列表
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETSURNAMELIST', result);
    },
    async getSurnameDetail({ commit }, data){//姓氏详情
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETSURNAMEDETAIL', result);
    },
    async getSurnameTotal({ commit }, data){//姓氏总数
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETSURNAMETOTAL', result);
    },
    async getSurnameSort({ commit }, data){//姓氏排序
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETSURNAMESORT', result);
    },
    async getSurnameGenealogy({ commit }, data){//姓氏家谱
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETSURNAMEGENEALOGY', result);
    },
    async getCatalogList({ commit }, data){//姓氏家谱
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETCATALOGLIST', result);
    },
    async getCatalogSurnameList({ commit }, data){//姓氏家谱统计
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETCATALOGSURNAMELIST', result);
    },
    async getGenealogySummary({ commit }, data){//家谱详情
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETGENEALOGYSUMMARY', result);
    },
    async getGenealogyView({ commit }, data){//家谱影像
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('GETGENEALOGYVIEW', result);
    },
    async getFamilyDisciplineList({ commit }, data){//家规家训列表
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETFAMILYDISCIPLINELIST', result);
    },
    async getFamilyDisciplineDetail({ commit }, data){//家规家训详情
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETFAMILYDISCIPLINEDETAIL', result);
    },
    async checkData({ commit }, data){//姓氏相关数据判断
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        commit('CHECKDATA', result);
    },
    async getPinYin({ commit }, data){//根据姓氏获取拼音
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        return result;
    },
}


const mutations = {
    CHANGEPROPERTYVALUE(state, data){
        state[data.property] = data.value;
    },
    CHECKDATA(state,data){
        state.checkDatas = data.data;
    },
    GETCELEBRITYPROFILE(state,data){
        state.celebrityProfile = data.data;
    },
    GETCELEBRITYDYNASTY(state,data){
        state.celebrityDynastyList = data.data;
        state.celebrityAllTotal = data.total;
    },
    GETCELEBRITYLIST(state,data){
        let celebrityList = data.result;
        celebrityList.map((item) => {
            item.birthDate = item.birthDate ? (item.birthDate + '').replace(/-/g,'B.C.') : '';
            item.deadDate = item.deadDate ? (item.deadDate+'').replace(/-/g,'B.C.') : '';
            item.img = item.img + '?imageView2/2/w/700';
        });
        if(data.page == 1){
            state.celebrityList =  celebrityList;
        }else{
            state.celebrityList =  state.celebrityList.concat(celebrityList);
        }
        state.celebrityPages = data.pageNum;
        state.celebrityTotal = data.total;
    },
    GETCELEBRITYLABEL(state,data){
        state.celebrityLabelList = data.data;
    },
    GETFAMILYDISCIPLINEDETAIL(state,data){
        state.familyDisciplineDetail = data.list;
    },
    GETFAMILYDISCIPLINELIST(state,data){
        state.familyDisciplineList = data.list;
    },
    GETGENEALOGYVIEW(state,data){
        state.genealogyViews = [];
        let genealogyViews = [];
        data.result.map((item,index)=>{
            genealogyViews.push(item);
        });
        state.genealogyViews = genealogyViews;
        state.genealogyViewTotal = genealogyViews.length;
    },
    GETGENEALOGYSUMMARY(state,data){
        state.genealogySummary = data.resultList || {};
    },
    GETSURNAMEGENEALOGY(state,data){
        state.genealogyList = data.data;
    },
    GETCATALOGSURNAMELIST(state,data){
        state.genealogySurnameList = data.data;
    },
    GETCATALOGLIST(state,data){
        state.genealogyList = data.data;
    },
    GETSURNAMELIST(state,data){
        state.surnames = data.result;
    },
    GETSURNAMETOTAL(state,data){
        let surnameTotal = data.result[0].totalCount || (data.result[0].count)*1400000000,surnameTotalArr=[],surnameTotalArrs=[];
        console.log(surnameTotal);
        surnameTotalArr = [surnameTotal,surnameTotal*5,surnameTotal*3,surnameTotal/2];
        surnameTotalArr = ADS.ArrRandomSort(surnameTotalArr);
        surnameTotalArr.map((item)=>{surnameTotalArrs.push({'ZH':ADS.numberFormat(item),'EN':ADS.numberFormatE(item)})});
        state.surnameTotal = {'ZH':ADS.numberFormat(surnameTotal),'EN':ADS.numberFormatE(surnameTotal)};
        state.surnameTotalArr = surnameTotalArrs;
    },
    GETSURNAMESORT(state,data){
        state.surnameSortList = data.result;
        state.surnames = data.result;
        state.surnameSortPages = data.pageNum;
    },
    GETSURNAMEDETAIL(state,data){
        let detail=data.detail;
        for(let key in detail){
            detail[key] = detail[key].replace(/src\="\/surname/g,'src="https://cdn-icare.qingtime.cn'); //.replace(/style\=\"/g,'').replace(/style\=\'/g,'')
        }
        // content=content.replace(/src\="\/surname/g,'src="https://cdn-icare.qingtime.cn');
        state.surnameDetail = detail;
        state.surSummary = data.summary;
    },
}

export default {
    state,
    actions,
    mutations
}
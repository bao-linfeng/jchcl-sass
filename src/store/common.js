import ADS from "../utils/ADS.js";
const state = {
    loading:false,
    token:ADS.getLocalStorage('token') || '',
    userKey: ADS.getLocalStorage('userKey') || '',
    profile: ADS.getLocalStorage('profile') || '',
    mobile:ADS.getLocalStorage('mobile') || '',
    avatar:ADS.getLocalStorage('avatar') || '',
    userRole:ADS.getLocalStorage('userRole') || 0,
    userName:ADS.getLocalStorage('userName') || '',
    origin:window.location.origin,

    recentCollects:[{label:'鲍林峰'},{label:'阿呆'}],
    myCommissions:[1,2,3],
    recentSearchs:[{label:'鲍林峰'},{label:'阿呆'}],
    isLogin:false,
    qiniuToken:'',
    offerings:[],
    offeringsPages:0,
    shrineRandomList:[],
    altarTypeList:[],
    altarDetail:{},
    altarList:[],
    CX:window.innerWidth >= 400 ? 200 : window.innerWidth/2,
    CY:window.innerWidth >= 400 ? 200 : window.innerWidth/2,
    RADIUS:window.innerWidth >= 400 ? 200 : window.innerWidth/2,
    altarMessageList:[],
    altarMessageUser:[],
    altarMessagePages:0,
    offeringChecks:{},
    tagList:[],
    myRight:{},
    myRightList:[],
    userUpgrades:[],
    freeValue: ADS.getLocalStorage('freeValue') || '',
    donateList:[],
    shrineRandomPages:0,
    musicList:[],
}

const actions = {
    async getUserInfo ({ commit }, data){
        let result=await ADS.AdaiXHR(data.url,data.body,'GET',true);
        return result;
    },
    async getQiniuToken({ commit }, data){//七牛token
        let result=await ADS.AdaiXHR(data.url,data.body,'POST',true);
        commit('GETQINIUTOKEN', result);
    },
    async sendWord({ commit }, data){//寄语
        let result=await ADS.AdaiXHR(data.url,data.body,'POST');
        return result;
    },
    async openLight({ commit }, data){//开光
        let result=await ADS.AdaiXHR(data.url,data.body,'PATCH');
        return result;
    },
    async offerUp({ commit }, data){//上供
        let result=await ADS.AdaiXHR(data.url,data.body,'POST');
        return result;
    },
    async saveUser({ commit }, data){//保存用户信息
        let result=await ADS.AdaiXHR(data.url,data.body,'POST');
        return result;
    },
    async getShrineRandomList({ commit }, data){//神坛随机数据
        let result=await ADS.AdaiXHR(data.url,data.body,'GET');
        commit('GETSHRINERANDOMLIST', result);
    },
    async altarType({ commit }, data){//神坛风格
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('ALTARTYPE', result);
    },
    async addAltar({ commit }, data){//新建神坛
        let result=await ADS.AdaiXHR(data.url,data.body,'POST');
        return result;
    },
    async editAltar({ commit }, data){//编辑神坛
        let result=await ADS.AdaiXHR(data.url,data.body,'POST');
        return result;
    },
    async getAltarDetail({ commit }, data){//神坛详情
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETALTARDETAIL', result);
        return result.data;
    },
    async collectAltar({ commit }, data){//收藏神坛
        let result=await ADS.AdaiXHR(data.url,data.body,'POST');
        return result;
    },
    async getAltar({ commit }, data){//神坛列表
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETALTAR', result);
    },
    async getAltarCollectList({ commit }, data){//我的收藏神坛列表
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETALTARCOLLECTLIST', result);
    },
    async getAltarMessageList({ commit }, data){//神坛心声、上供列表
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETALTARMESSAGELIST', result);
    },
    async incenseAltar({ commit }, data){//上香
        let result=await ADS.AdaiXHR(data.url,data.body,'POST');
        return result;
    },
    async getAltarMessageUser({ commit }, data){//上香列表-人物列表
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETALTARMESSAGEUSER', result);
    },
    async deletAltareMessage({commit},data){
        let result=await ADS.AdaiXHR(data.url,data.body,'DELETE');
        return result;
    },
    async altarForbiddenMessage({commit},data){
        let result=await ADS.AdaiXHR(data.url,data.body,'POST');
        return result;
    },
    async manageAltarMessage({commit},data){
        let result=await ADS.AdaiXHR(data.url,data.body,'PATCH');
        return result;
    },
    async getTagList({ commit }, data){//标签列表
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETTAGLIST', result);
    },
    async getOfferingList({ commit }, data){//供品列表
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETOFFERINGLIST', result);
    },
    async supplyAltar({commit},data){//上供
        let result=await ADS.AdaiXHR(data.url,data.body,'POST');
        return result;
    },
    async getMyRight({ commit }, data){//我的权益
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETMYRIGHT', result);
    },
    async getMyRightList({ commit }, data){//权益列表
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETMYRIGHTLIST', result);
    },
    async altarComplaint({commit},data){//投诉
        let result=await ADS.AdaiXHR(data.url,data.body,'POST');
        return result;
    },
    async familyAltar({ commit }, data){//树上节点是否存在
        let result=await ADS.AdaiXHR(data.url,data.body);
        return result;
    },
    async userUpgrade({ commit }, data){//我的充值
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('USERUPGRADE', result);
    },
    async getShareWXInfo({commit},data){//获取微信信息
        let result=await ADS.AdaiXHR(data.url,data.body,'POST',true);
        return result;
    },
    async getMyDonateList({ commit }, data){//捐赠列表
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETMYDONATELIST', result);
    },
    async getMusicList({ commit }, data){//音乐列表
        let result=await ADS.AdaiXHR(data.url,data.body);
        commit('GETMUSICLIST', result);
    },
}


const mutations = {
    GETQINIUTOKEN(state,data){
        if(data.statusCode == 200){
            state.qiniuToken = data.data || '';
            state.isLogin = true;
        }else if(data.statusCode == 701){
            state.qiniuToken = '';
            state.isLogin = false;
        }
    },
    GETSHRINERANDOMLIST(state,data){
        let tags=data.data,tagsNum = tags.length; 
        tags.map((item,index)=>{
            let k = -1 + (2 * (index + 1) - 1) / tagsNum;
            let a = Math.acos(k);
            let b = a * Math.sqrt(tagsNum * Math.PI)//计算标签相对于球心的角度
            item.text = item.title;
            item.x = state.CX +  state.RADIUS * Math.sin(a) * Math.cos(b);//根据标签角度求出标签的x,y,z坐标
            item.y = state.CY +  state.RADIUS * Math.sin(a) * Math.sin(b); 
            item.z = state.RADIUS * Math.cos(a);
            item.color = "rgb(255,255,255)";
            // item.color = "rgb("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")";
            item.href = '/HumanSummary?k='+item._key;//给标签添加链接
        });
        state.shrineRandomList = tags;
        state.shrineRandomPages = data.pageNum;
    },
    ALTARTYPE(state,data){
        state.altarTypeList = data.data;
    },
    GETALTARDETAIL(state,data){
        state.altarDetail = data.data;
    },
    GETALTAR(state,data){
        state.altarList = data.data;
    },
    GETALTARCOLLECTLIST(state,data){
        state.recentCollects = data.data;
    },
    GETALTARMESSAGELIST(state,data){
        if(data.page == 1){
            state.altarMessageList = data.data;
        }else{
            state.altarMessageList = state.altarMessageList.concat(data.data);
        }
        // state.altarMessageList = data.data;
        state.altarMessagePages = data.pageNum;
    },
    GETALTARMESSAGEUSER(state,data){
        state.altarMessageUser = data.data;
    },
    GETOFFERINGLIST(state,data){
        state.offerings = data.data;
        state.offeringsPages = data.pageNum;
    },
    GETTAGLIST(state,data){
        state.tagList = data.data;
    },
    GETMYRIGHT(state,data){
        state.myRight = data.data;
        state.freeValue = data.freeValue;
        ADS.setLocalStorage('freeValue',data.freeValue);
    },
    GETMYRIGHTLIST(state,data){
        state.myRightList = data.data;
    },
    USERUPGRADE(state,data){
        state.userUpgrades = data.data;
    },
    GETMYDONATELIST(state,data){
        state.donateList = data.data;
    },
    GETMUSICLIST(state,data){
        state.musicList = data.data;
    },
}

export default {
    state,
    actions,
    mutations
}
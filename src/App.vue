<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <div class="loading" v-if="isShow">
      <p>您无权查看本项目，请联系时光公司!</p>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "./utils/ADS.js";
export default {
  name: "app",
  data: () => {
    return {
      isShow: true,
    };
  },
  created:function(){
    let t = ADS.getQueryVariable('t') || this.domain;
    console.log(t);
    this.getVersionDetail(t);
  },
  mounted:function(){
    // 禁止右键
    document.oncontextmenu = function(){return false;}
    document.onmousedown = function(){
      if(event.button == 2){
        return false;
      }
		}
  },
  methods:{
    async getVersionDetail(domain){
      this.$store.dispatch('changePropertyValue', {property: 'domain', value: domain});
      ADS.setLocalStorage('domain', domain);
      let res = await ADS.AdaiXHR('https://fdcskcydata.qingtime.cn/version/detail', {'domain': domain}, 'GET', true);
      if(res.status == 200){
        if(res.data.status == 1){
          this.isShow = false;
          this.$store.dispatch('changePropertyValue', {property: 'logo', value: res.data.logo});
          this.$store.dispatch('changePropertyValue', {property: 'covers', value: res.data.covers});
          this.$store.dispatch('changePropertyValue', {property: 'surname', value: res.data.surname});
          this.$store.dispatch('changePropertyValue', {property: 'province', value: res.data.province});
          this.$store.dispatch('changePropertyValue', {property: 'city', value: res.data.city});
          this.$store.dispatch('changePropertyValue', {property: 'district', value: res.data.district});
          this.$store.dispatch('changePropertyValue', {property: 'pageNum', value: res.data.pageNum});

          this.$store.dispatch('changePropertyValue', {property: 'title', value: res.data.title});
          this.$store.dispatch('changePropertyValue', {property: 'customName', value: res.data.customName});
          this.$store.dispatch('changePropertyValue', {property: 'catalogSource', value: res.data.catalogSource || 1});

          ADS.setLocalStorage('surname', res.data.surname || '');
          ADS.setLocalStorage('province', res.data.province || '');
          ADS.setLocalStorage('city', res.data.city || '');
          ADS.setLocalStorage('district', res.data.district || '');
          ADS.setLocalStorage('pageNum', res.data.pageNum || '');

          ADS.setLocalStorage('title', res.data.title || '');
          ADS.setLocalStorage('customName', res.data.customName || '');
          ADS.setLocalStorage('catalogSource', res.data.catalogSource || '1');
        }else{
          this.isShow = true;
        }
      }else{
        // ADS.message(res.msg);
        this.isShow = true;
      }
    },
  },
  computed: {
    key() {
        return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
    },
    ...mapState({
      loading: state => state.common.loading,
      domain: state => state.surname.domain,
      title: state => state.surname.title,
      customName: state => state.surname.customName,
    })
  },
};
</script>
<style>
@font-face {
  font-family: 'PingFangSC_Medium';
  src: url('https://cdn-icare.qingtime.cn/PingFang_Medium.otf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'PingFang_Regular';
  src: url('https://cdn-icare.qingtime.cn/PingFang_Regular.otf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'PingFang_Bold';
  src: url('https://cdn-icare.qingtime.cn/PingFang_Bold.otf') format('truetype');
}
@font-face {
  font-family: 'MuseoSlab';
  src: url('https://cdn-icare.qingtime.cn/museo_slab_300_webfont.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
.fontSize70{
  font-size: 7rem;
}
.fontSize60{
  font-size: 6rem;
}
.fontSize50{
  font-size: 5rem;
}
.fontSize48{
  font-size: 4.8rem;
}
.fontSize44{
  font-size: 4.4rem;
}
.fontSize42{
  font-size: 4.2rem;
}
.fontSize40{
  font-size: 4rem;
}
.fontSize38{
  font-size: 3.8rem;
}
.fontSize36{
  font-size: 3.6rem;
}
.fontSize32{
  font-size: 3.2rem;
}
.fontSize30{
  font-size: 3rem;
}
.fontSize28{
  font-size: 2.8rem;
}
.fontSize26{
  font-size: 2.6rem;
}
.fontSize22{
  font-size: 2.2rem;
}
.fontSize20{
  font-size: 2rem;
}
.fontSize18{
  font-size: 1.8rem;
}
.fontSize16{
  font-size: 1.6rem;
}
.fontSize14{
  font-size: 1.4rem;
}
.MuseoSlab300{
  font-family: 'MuseoSlab';
}
.PingFangSC_Medium{
  font-family: 'PingFangSC_Medium';
}
.PingFang_Bold{
  font-family: 'PingFang_Bold';
}
.PingFang_Regular{
  font-family: 'PingFang_Regular';
}
*{
	padding:0;
	margin:0;
}
html{
  position: relative;
  width: 100%;
	height: 100%;
  font-family: 'PingFang SC','Source Han Sans CN','Microsoft Yahei';
	font-size: 62.5%;
}
body {
  position: relative;
  width: 100%;
	height: 100%;
	font-size: 1.6rem;
  -webkit-tap-highlight-color: transparent;
}
a{
	text-decoration: none;
  color: #358acd;
}
ul{
	list-style: none;
}
i{
  font-style: normal;
  color: #5CB483;
}
input,textarea{
  /* ios input、textarea上边框有阴影 */
  box-shadow:0px 0px 0px rgba(0,0,0,0); 
  -webkit-appearance:none;
  -webkit-tap-highlight-color:transparent;
  font-size: 1.6rem;
}
button{
  font-size: 1.6rem;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
  color: #333;
}
.amap-info-close{
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 40px;
}
.adai_map_title{
  position: relative;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  /* border: 2px solid #86B93F; */
  font-size: 20px;
  background: #5CB483;
  /* padding-right: 4px; */

}
.adai_map_title::after{
  position: absolute;
  top: 40px;
  left: 18px;
  content: '';
  width: 0;
  height: 0;
  border-top: 20px solid #5CB483;
  border-right: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid transparent;
}
.adai_map_title_in{
  height: 40px;
  line-height: 40px;
  /* border-radius: 20px; */
  overflow: hidden;
  display: flex;
  align-items: center;
}
.adai_map_name{
  color: #fff;
  display: block;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  /* background: #86B93F; */
}
.adai_map_percentage{
  width: 80px;
  display: block;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  background: #fff;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  color: #5CB483;
}
.adai_title_wrap{
    position: relative;
    width: calc(100% - 20px);
    background: transparent;
    display: flex;
    padding: 40px 0;
}
.adai_title_wrap img{
    width: 68px;
    height: 68px;
    cursor: pointer;
    margin: 0 20px 0 36px;
}
.adai_title_box{
    color: #fff;
}
.perspective_3d{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 500px;
  overflow: hidden;
}
.animate_rotate{
  /* transform: rotateY(180deg); */
  animation: animate_rotateY180deg 1.5s linear;
}
@keyframes animate_rotateY180deg{
  from{
    opacity: 1;
    transform: rotateY(0);
  }
  to{
    opacity: 0.1;
    transform: rotateY(180deg);
  }
}
.animate_rotate_resive{
  /* transform: rotateY(-180deg); */
  animation: animate_rotateY_180deg 1.5s linear;
}
@keyframes animate_rotateY_180deg{
  from{
    opacity: 1;
    transform: rotateY(0);
  }
  to{
    opacity: 0.1;
    transform: rotateY(-180deg);
  }
}
.msg_wrap{
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  background: #5CB483;
  padding: 5px 15px;
  border-radius: 3px;
  text-align: center;
  color: #333;
  min-width: 80px;
  z-index: 1000000000;
  font-size: 2rem;
}
.msg_wrap_ok{
  background: #f0f9eb;
  color: #5CB483;
}
.msg_wrap_warn{
  background:#fdf6ec;
  color: #e6a23c;
}
.amap-logo,.amap-copyright{
  opacity: 0;
  left: -100000px;
}
.el-message-box__wrapper .el-message-box{
  width: calc(100% - 20px);
  max-width: 420px;
}
.el-carousel__indicators--horizontal{
  width: 100%;
}
.fr-wrapper > div[style*="z-index:9999"]{
  position:absolute;
  top:-10000px;
  opacity: 0;
}
.fr-element.fr-view{
  position: absolute;
  top:0;
}
.fr-placeholder{
  margin-top: 0 !important;
}
.second-toolbar{
  opacity: 0;
  display: none;
}
.fr-box.fr-basic .fr-element {
  padding: 10px;
  width: 100%;
}

.style2::-webkit-scrollbar-track{
	border-radius: 2px;
	background-color: transparent;
}
.style2::-webkit-scrollbar{
	height: 4px;
	background-color: transparent;
}
.style2::-webkit-scrollbar-thumb{
	border-radius: 2px;
	background: #888;
}
.style2::-webkit-scrollbar-corner{
	background-color: transparent;
}

.style1::-webkit-scrollbar-track{
	border-radius: 2px;
	background-color: transparent;
}
.style1::-webkit-scrollbar{
	width: 4px;
	background-color: transparent;
}
.style1::-webkit-scrollbar-thumb{
	border-radius: 2px;
	background: #888;
}
.style1::-webkit-scrollbar-corner{
	background-color: transparent;
}
.a_button{
  display: inline-block;
  width: 400px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  cursor: pointer;
  background: #5CB483;
  border-radius: 50px;
  color: #fff;
  outline: none;
  border: none;
}
.a_button.active{
  background: #5CB483;
  opacity: 0.6;
  cursor: wait;
}
.hb{
  font-size: 6rem;
  font-family: PingFangSC-Regular;
}
.h{
  font-size: 4.8rem;
}
.hs{
  font-size: 3.8rem;
}
.p{
  font-size: 3rem;
  font-family: MuseoSlab-300;
}
.ps{
  font-size: 2.8rem;
}
.pf{
  font-size: 2rem;
  font-family: PingFangSC-Regular;
}
.fontSize60{
  font-size: 6rem;
}
.fontSize48{
  font-size: 4.8rem;
}
.fontSize38{
  font-size: 3.8rem;
}
.fontSize30{
  font-size: 3rem;
}
.fontSize28{
  font-size: 2.8rem;
}
.fontSize26{
  font-size: 2.6rem;
}
.fontSize24{
  font-size: 2.4rem;
}
.fontSize20{
  font-size: 2rem;
}
.fontSize18{
  font-size: 1.8rem;
}
.fontSize16{
  font-size: 1.6rem;
}
.KaiTi{
  font-family: 'KaiTi';
}
.marginTop30{
  margin-top: 30px;
}
/* 地图 */
.adai_map_content{
  display: flex;
  padding: 46px 36px;
}
.adai_map_content_cover{
  position: relative;
  width: 240px;
  height: 300px;
  background: #f1f1f1 url('./assets/cover.jpg') 50% 50% no-repeat;
  background-size: cover;
  box-shadow: 0 0 0 1px #f1f1f1;
}
.adai_map_content_cover i{
  position: absolute;
  top: 70px;
  right: 80px;
  bottom: 45px;
  color: #fff;
  font-style: normal;
  font-size: 1.6rem;
  writing-mode:tb-rl;
  text-align: left;
  line-height: 20px;
  letter-spacing: 2px;
  display: block;
}
.adai_map_content_desc{
  width: 320px;
  color: #999;
  margin-left: 20px;
}
.adai_map_content_desc h3{
  margin-bottom: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.adai_map_content_desc p{
  margin-bottom: 20px;
}
.adai_map_content_desc a{
  width: 240px;
  height: 70px;
  line-height: 70px;
  background: #5CB483;
  border-radius: 35px;
  display: inline-block;
  cursor: pointer;
  color: #fff;
  text-align: center;
  /* margin-top: 10px; */
}
:root{
  --bg-color:#000;
  --text-color:#5CB483;
}
/* 设置input 文本框的 placeholder 的颜色 */
input::-webkit-input-placeholder{
  color:rgba(144,147,153,1);
}
/* 去除ios 手机端input输入框的内阴影 */
input{
  -webkit-appearance: none; 
}
/* 一像素边框的问题 */
.row {
  position: relative;
}
.row::after{
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  border-bottom:1px solid #e6e6e6;
  color: red;
  height: 200%;
  -webkit-transform-origin: left top;
  transform-origin: left top;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none; /* 防止点击触发 */
  box-sizing: border-box;
}
/* 该属性会导致安卓页面无法滚动，慎用! */
.touch_action{
  touch-action:none;
}
/* 扩大可点击区域 */
.expand-range {
  position: relative;
}
.expand-range:after {
  content: '';
  position: absolute;
  top: -10px; right: -10px; bottom: -10px; left: -10px;
}
/* 边框内圆角 */
.border_inner_radius{
  position: relative;
  padding: 10px;
  z-index: 1;
}
.border_inner_radius:after{
  content: '';
  position: absolute;
  left: 10px;
  top: 10px;
  right: 10px;
  bottom: 10px;
  z-index: -1;
  border-radius: 5px;
}
/* 不规则投影 */
.drop_shadow{
  filter: drop-shadow(0 0 5px #417505);
}
/* 半透明边框 */
.border_transparent_half{
  border: 10px solid rgba(255, 255, 255, .5);
  background: white;
  background-clip: padding-box;
}
/* 折角 */
.zhejiao {
  position: relative;
  width: 200px;
  height: 100px;
  background:
    linear-gradient(-150deg, transparent 1.5em, cyan 0);
  border-radius: .5em;
}
.zhejiao:after {
  content: '';
  position: absolute;
  right: 0;
  width: 1.73em;
  height: 3em;
  background:
    linear-gradient(to left bottom, transparent 50%, red 0);
  transform: translateY(-1.3em) rotate(-30deg);
  transform-origin: bottom right;
  border-bottom-left-radius: inherit;
}
/* 会动的背景 */
.panoramic {
	width: 150px; 
  height: 150px;
	background: url('http://c3.staticflickr.com/3/2671/3904743709_74bc76d5ac_b.jpg');
	background-size: auto 100%;	
	animation: panoramic 10s linear infinite alternate;
}
.panoramic:hover {
	animation-play-state: paused;
}
@keyframes panoramic {
	to { background-position: 100% 0; }
}
/* 渐变色文字 */
.gradient-text {
  background-image: linear-gradient(90deg, red, blue);
  background-clip: text;
  color: transparent;
}
/* 下划线动画效果 */
.fancy-link {
  text-decoration: none;
  background-image: linear-gradient(red, red);
  background-repeat: no-repeat;
  background-position: bottom left;
  background-size: 0 3px;
  transition: background-size 500ms ease-in-out;
}

.fancy-link:hover {
  background-size: 100% 3px;
}
/* 顺滑滚动 */
.scroll-behavior{
  scroll-behavior: smooth;
}
/* text-shadow 多阴影设置 */
.so-many-shadows {
  text-shadow: 
    3px 3px 0 yellow, 
    6px 6px 0 blue, 
    9px 9px red,
    12px 12px 0 black;
}
/* 使用 outline 实现偏移“边框”效果 */
.outline {
  outline: 2px solid white;
  outline-offset: -10px;
}
/* 响应式多列布局 */
.content {
  columns: 200px;
}
/* 贴底footer */
.card__footer {
  margin-top: auto;
}
/* 为被选择的文本设置样式 */
.selection::selection {
  background-color: var(--text-color);
  color: white;
}
/* 控制第一个子元素样式 */
.child-first:first-of-type { font-size: 1.25rem; }
@media screen and (max-width: 1366px) and (min-width: 1050px){
  .a_button{
    width: 240px;
    height: 60px;
    line-height: 60px;
    border-radius: 30px;
    font-size: 34px;
  }
  .adai_map_content{
    padding: 28px 20px;
  }
  .adai_map_content_cover{
    width: 144px;
    height: 180px;
  }
  .adai_map_content_cover i{
    font-size: 10px;
    top: 40px;
    right: 45px;
    bottom: 25px;
    line-height: 15px;
  }
  .adai_map_content_desc{
    margin-left: 12px;
  }
  .adai_map_content_desc h3{
    font-size: 18px;
    margin-bottom: 12px;
  }
  .adai_map_content_desc p{
    font-size: 16px;
    margin-bottom: 12px;
  }
  .adai_map_content_desc a{
    width: 140px;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    font-size: 16px;
    /* margin-top: 65px; */
  }
}
.loading{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>

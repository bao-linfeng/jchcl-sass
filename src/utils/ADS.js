
import router from "../router";
function params(str){
    let arr='',obj={};
    if(str && str.substr(0,1) && str.substr(0,1) == '?'){
        arr=str.substr(1).split('&');
        if(arr && arr.length){
            arr.map((item,key)=>{
                obj[item.split('=')[0]]=item.split('=')[1];
            })
        }
    }
    return obj;
}



function Uint8ArrayToString(fileData){
    var dataString = "";
    for (var i = 0; i < fileData.length; i++) {
      dataString += String.fromCharCode(fileData[i]);
    }
   
    return dataString
}

// 解压
function unzip(key) {
    // 将二进制字符串转换为字符数组
    var charData = key.split('').map(function (x) { return x.charCodeAt(0); });
    //console.log('压缩后的文件大小:', charData.join(","))
   
    // 将数字数组转换成字节数组
    var binData = new Uint8Array(charData);
   
    // 解压
    var data = pako.inflate(binData);

    var Uint8ArrayData=new Uint8Array(data);
    key=Uint8ArrayToString(Uint8ArrayData);
   
    // 将GunZip ByTAREAR转换回ASCII字符串
    //key = String.fromCharCode.apply(null, new Uint16Array(data));//数据太大时，报错
   
    //unescape(str)  --->解压后解码，防止中午乱码
    return unescape(key);
}
   
// 压缩
function zip(str) {
    //escape(str)  --->压缩前编码，防止中午乱码
    var binaryString = pako.gzip(escape(str), { to: 'string' });
    return binaryString;
}

function Appendzero(obj) {
	if (obj < 10) return "0" + obj;
	else return obj;
}

// Array.prototype.forEach = function(callback){
//     for(var i=0;i<this.length;i++){
//         callback.call(this[i]);
//     }
// }

//生成固定格式时间
function getLocalTime(nS, symbol, index) {
    if(nS){
        symbol = symbol || '-';
        index = index || 5;
        var date = new Date(nS),
            Y, M, D, h, m, s;
        Y = date.getFullYear() + symbol;
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + symbol;
        D = date.getDate() + ' ';
        h = Appendzero(date.getHours()) + ':';
        m = Appendzero(date.getMinutes()) + ':';
        s = Appendzero(date.getSeconds());
        switch (index) {
            case 1:
                return (Y + M + D);
            case 2:
                return (Y + M);
            case 3:
                return (M + D);
            case 4:
                return (h + m + s);
            case 5:
                return (Y + M + D + h + m + s);
        }
    }else{
        return '';
    }
}


//生成随机数
function GetRandomNum(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	return (Min + Math.floor(Rand * Range));
}

function isToday(time) {
    if (new Date(time).getDate() === new Date().getDate()) {
        //今天
        return '今日'
    } else if (new Date(time).getDate() === (new Date().getDate() - 1)){
        //之前
        return '昨日'
    }
}

function getTime(nS, symbol, index) {
    if(nS){
        symbol = symbol || '-';
        index = index || 5;
        var date = new Date(nS),
            Y, M, D, h, m, s;
        Y = date.getFullYear() + symbol;
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + symbol;
        D = date.getDate() + ' ';
        h = Appendzero(date.getHours()) + ':';
        m = Appendzero(date.getMinutes()) + ':';
        s = Appendzero(date.getSeconds());
        // switch (index) {
        //     case 1:
        //         return (Y + M + D);
        //     case 2:
        //         return (Y + M);
        //     case 3:
        //         return (M + D);
        //     case 4:
        //         return (h + m + s);
        //     case 5:
        //         return (Y + M + D + h + m + s);
        // }
        if(isToday(nS) == '今日'){
            return ('今日 '+h + m + s);
        }else if(isToday(nS) == '昨日'){
            return ('昨日 '+h + m + s);
        }else{
            return (Y + M + D);
        }
    }else{
        return '';
    }
}

/**
 * 人性化时间处理 传入时间戳
 */
function timeago(timestamp){
	var mistiming=Math.round((new Date())-timestamp)/1000;

	if(mistiming <= 1){
		return '1秒前';
	}
    var arrr = ['年','个月','星期','天','小时','分钟','秒'];
    var arrn = [31536000,2592000,604800,86400,3600,60,1];
    let inms=[];
    for(var i=6;i>=0;i--){
        var inm = Math.floor(mistiming/arrn[i]);
        if(inm != 0){
            inms.push(inm+arrr[i]+'前');
        }
    }

    return inms[inms.length-1]
}

function getLocalStorage(key){
    return window.localStorage && window.localStorage.getItem(key);
}
function setLocalStorage(key,value){
    return window.localStorage && window.localStorage.setItem(key,value);
}

var dateCalculation = function(second) { //返回天、时、分
    if(!second){return ''}
    var type = '';
    var day = 0;
    var hour = 0;
    var minute = 0;
    var second2 = Math.floor(Math.abs(second)/1000)%60;
    minute = Math.floor(Math.abs(second)/1000/(60));
    second < 0 ? type = '-' : null;
    
    if (parseInt(minute) > 60) {
        hour = parseInt(minute / 60);
        minute %= 60; //算出有多分钟
    }
    if (parseInt(hour) > 24) {
        day = parseInt(hour / 24);
        hour %= 24; //算出有多分钟
    }
    
    if(day){
        return (type+day+'天'+hour+'小时'+minute+'分'+second2+'秒');
    }else if(hour){
        return (type+hour+'小时'+minute+'分'+second2+'秒');
    }else if(minute){
        return (type+minute+'分'+second2+'秒');
    }else{
        return (type+second2+'秒')
    }
}

function obj2str(obj){
    let str ='',isFirst=true;
    for(var key in obj){
        str = str +(isFirst ? '?' : '&')+ key + '=' +obj[key];
        isFirst = false;
    }
    return str;
}

function message(msg='ok',flag=false){
    let time = Date.now(),className = flag ? 'msg_wrap_ok' : 'msg_wrap_warn';

    var str='<span id='+time+' class="msg_wrap '+className+'">'+msg+'</span>';
    var range=document.createRange();
    range.selectNodeContents(document.documentElement); 
    var fragment =range.createContextualFragment(str);
    document.body.appendChild(fragment);

    setTimeout(function(){
        document.body.removeChild(document.getElementById(time));
    },3000);
}

function AdaiXHR(url,data,method='GET',flag=false){
    let APIURL='http://192.168.1.101:8529/_db/surname/citang/';
    APIURL = 'https://home.qingtime.cn/citang/';
    if(!window.location.port){APIURL = 'https://home.qingtime.cn/citang/';}
    // data['userKey'] = window.localStorage.getItem('userKey') || '';

    method == 'GET' ? url = url+obj2str(data) : null;
    return new Promise((resolve, reject) => {
        axios({
            'method':method,
            'url':flag ? url : (APIURL+url),
            'data':data
        })
        .then(function (response) {
            if(response.data.status == 200 || response.data.statusCode == 200){
                resolve(response.data);
            }else if(response.data.status == 701 || response.data.statusCode == 701){
                gotoLogin();
            }else{
                message(response.data.msg);
            }
        })
        .catch(function (error) {
            message(error);
            // reject(error);
        });
    })
}
// 并集
Array.prototype.union = function(arr){
    var tempArr = this.slice();
    arr.forEach(function(v) {
        !tempArr.includes(v) && tempArr.push(v)
    });
    return tempArr;
}

function logout(){
    window.localStorage.setItem('userKey','');
    window.localStorage.setItem('userName','');
    window.localStorage.setItem('mobile','');
    window.localStorage.setItem('token','');
    window.localStorage.setItem('avatar','');
    // this.$router.push('/linkPage'); 
    gotoLogin();
}


/**
 * html2canvas -> Canvas2Image
 * html DOM 转换成图片
 */
function convert2canvas(id,callback) {
    var shareContent = document.querySelector(id);//需要截图的包裹的（原生的）DOM 对象
    var width = shareContent.offsetWidth; //获取dom 宽度
    var height = shareContent.offsetHeight; //获取dom 高度
    var canvas = document.createElement("canvas"); //创建一个canvas节点
    var scale = 2; //定义任意放大倍数 支持小数
    canvas.width = width * scale; //定义canvas 宽度 * 缩放
    canvas.height = height * scale; //定义canvas高度 *缩放
    canvas.getContext("2d").scale(scale, scale); //获取context,设置scale 
    var opts = {
        scale: scale, // 添加的scale 参数
        canvas: canvas, //自定义 canvas
        // logging: true, //日志开关，便于查看html2canvas的内部执行流程
        width: width, //dom 原始宽度
        height: height,
        useCORS: true // 【重要】开启跨域配置
    };
    
    html2canvas(shareContent, opts).then(function (canvas) {
        var context = canvas.getContext('2d');
        // 【重要】关闭抗锯齿
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        //获取base64
        let base64='';
        base64 = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream")
        // 【重要】默认转化的格式为png,也可设置为其他格式
        // var img = Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height);
        callback(base64);
    });
}

function gotoLogin(){//跳转统一登录页面
    window.location.href = 'https://account.qingtime.cn?apphigh=32&logo=https://ssx.qingtime.cn/logo.svg&redirect='+window.location.origin+'/PerfumeUpHome';
};

//防抖
function debounce(fn,wait){
    let timeout = null;
    return function(){
        if(timeout !== null) clearTimeout(timeout);
        timeout = setTimeout(fn,wait);
    }
}

function throttle(func,delay){//节流(时间戳+定时器)
    var timer = null;
    var startTime = Date.now();
    return function(){
        var curTime = Date.now();
        var remaining = delay - (curTime - startTime);
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        if(remaining <= 0){
            func.apply(context,args);
            startTime = Date.now();
        }else{
            timer = setTimeout(func,remaining);
        }
    }
}

function numberFormat(value) {
    var param = {};
    var k = 10000,
        sizes = ['', '万', '亿', '万亿'],
        i;
        if(value < k){
            if(value >= 1000 && value < 10000){
                param.value = '约'+Math.floor(value/1000)+'000';
            }else if(value >= 200 && value < 1000){
                param.value = '约'+Math.floor(value/100)+'00';
            }else if(value >= 50 && value < 200){
                param.value = '约100';
            }else{
                param.value = '约50' || Math.round(value);
            }
            
            param.unit=''
        }else{
            i = Math.floor(Math.log(value) / Math.log(k)); 
            if(value >= 100000 && value < 200000){
                param.value = '约'+Math.floor(value/10000);
            }else if(value >= 10000 && value < 100000){
                param.value = '约'+Math.floor(value/10000);
            }else{
                param.value = (value / Math.pow(k, i)).toFixed(2);
            }
            
            param.unit = sizes[i];
        }
        
        console.log(param.value);
    return (param.value+param.unit);
}

function numberFormatE(value) {
    var param = {};
    var k = 1000000,k2 = 1000000000;
        if(value < k){
            param.value =Math.round(value)
            param.unit=''
        }else if(value < k2/10){
            param.value = (value / k).toFixed(2);
            param.unit = ' Million';
        }else{
            param.value = (value / k2).toFixed(2);
            param.unit = ' Billion';
        }
    return (param.value+param.unit);
}

function ArrRandomSort(arr){//随机排序
    arr.sort(function(){
        return Math.random()-0.5;
    });
    return arr;
}

function dataURLtoBlob(dataurl) {// Base64转Blob对象
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
  
function blobToDataURL(blob, callback) { // Blob对象转Base64
    let a = new FileReader();
    a.onload = function (e) { 
        callback(e.target.result); 
    }
    a.readAsDataURL(blob);
}
  
  // 转Blob (url)
function getObjectURL(file) { 
    var url = null;
    if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
  
  // Base64转Blob对象
function dataURItoBlob(base64Data) {  
    var byteString;
    if(base64Data.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(base64Data.split(',')[1]);
    } else {
      byteString = unescape(base64Data.split(',')[1]);
      var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    }
    var ia = new Uint8Array(byteString.length);
    for(var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type: mimeString})
}
  
// 网络图片转base64
function convertImgToBase64(url, callback, outputFormat) { 
    var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    img = new Image;
    img.crossOrigin = 'Anonymous'
    img.onload = function() {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      var dataURL = canvas.toDataURL(outputFormat || 'image/png')
      callback.call(this, dataURL)
      canvas = null;
    };
    img.src = url;
}

//移动到指定位置
function adaiScrollIntoView(id){
    let ele = document.getElementById(id);
    ele && ele.scrollIntoView && ele.scrollIntoView();
}

function getQueryVariable(variable){
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for(let i=0; i < vars.length; i++){
        let pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return '';
}

export default {
    debounce,throttle,adaiScrollIntoView,GetRandomNum,
    unzip,zip,ArrRandomSort,numberFormatE,numberFormat,
    params,getLocalTime,timeago,logout,getLocalStorage,
    setLocalStorage,dateCalculation,AdaiXHR,message,logout,convert2canvas,getTime,gotoLogin,
    getQueryVariable,
}
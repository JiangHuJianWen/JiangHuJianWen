var nebulas = require("nebulas"),
    NebPay = require("nebpay"),
    Account = nebulas.Account,
    HttpRequest = nebulas.HttpRequest,
    Neb = nebulas.Neb;
    
var nasConfig = {
  mainnet: {
      chainID:'1',
      contractAddress: "n1jWgiSNrm8Qh7JPdTxLDNLv9Uegvdn47PB",
      host: "https://mainnet.nebulas.io",
      payHost: "https://pay.nebulas.io/api/mainnet/pay"
  },
  testnet: {
      chainID:'1001',
      contractAddress: "n1ez7YB3RxQiZn2mkmU83gQudmSi95ZPhZp",
      host: "https://testnet.nebulas.io",
      payHost: "https://pay.nebulas.io/api/pay"
  }
}
var neb = new Neb();
var chainInfo=nasConfig.mainnet;
// var chainInfo=nasConfig.testnet;

neb.setRequest(new HttpRequest(chainInfo.host));
var nasApi = neb.api;

var nebPay = new NebPay();

var account;
var isMobile;
var dappAddress=chainInfo.contractAddress;
var nonce = "0";
var gas_price = "1000000";
var gas_limit = "2000000";

var callbackUrl = NebPay.config.mainnetUrl; //在主网查询(默认值)
// var callbackUrl = NebPay.config.testnetUrl; //在测试网查询
var serialNumber;
var intervalQuery;  //定时查询交易结果  



// function getPerson() {
//   var from = Account.NewAccount().getAddressString();
//   var value = "0";
//   var callFunction = "getPerson";
//   var phoneNo = "0001";
//   var callArgs = "[\""  + phoneNo + "\"]"
//   var contract = {
//     "function" : callFunction,
//     "args" : callArgs,
//   }

//   neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
//     // cbSearch(resp);
//     console.log("resp = " + resp);
//   }) .catch(function(err) {
//     alert("购买成功,购买单号读取失败,请在'我的'模块中重新读取");
//   })
// }

var limit = 10;
var offset = 0;
function getInfos() {

  $("#load_loading").show();
  var from = Account.NewAccount().getAddressString();
  var value = "0";
  var callFunction = "getInfos";
  
  var callArgs = "[\"" + limit + "\",\"" + offset + "\"]"
  var contract = {
    "function" : callFunction,
    "args" : callArgs,
  }

  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
    cbSearch(resp);
    $("#load_loading").hide();

  }) .catch(function(err) {
    alert("失败");
    $("#load_loading").hide();
  })
}

//return of search,
function cbSearch(resp) {
  var result = resp.result;
  console.log("return of rpc call: " + JSON.stringify(result));
  var resultStringify = JSON.stringify(result);

  if (resultStringify.search("Error") !== -1) {
    
    alert("全部加载完毕");
  }
  //  else if (resultStringify.search("null") !== -1) {
  //   alert("购买成功,购买单号读取失败,请在'我的'模块中重新读取");
  // }
   else {  //搜索成功
    // result = JSON.parse(resultStringify);
    result = JSON.parse(result);
    result = JSON.parse(result);
    console.log("result = " + result);

    var html = $(".all-status").html();

    if (result.length > 0) {
      offset += 10; 
      console.log("offset = " + offset);
    } else {
      alert("最后一页");
      return;
    }

    for (var i = 0; i < result.length; i++) {
      var obj = result[i];
      var name = obj["name"];
      var content = obj["content"];
      var title = content["title"];
      var value = content["value"];

      html += '<div class="row"> <div class="row clearfix"> <div class="col-md-4 column"> <img src="img/jianghu2.jpg" width="60" height="60" /> </div> </div> <strong style="margin-top: 15px">'+ name +'</strong></div>  <div class="row clearfix"> <div class="col-md-12 column"> <strong>' + title + '</strong> <p>'+ value +'</p> </div> </div> </div> <hr>';

      // console.log("name = " + name);
    }

    $('.all-status').html(html);
  }
}

function getMyStory() {
  $("#load_mystory_loading").show();
  var from = Account.NewAccount().getAddressString();
  var value = "0";
  var callFunction = "getMyStory";
  var phoneNo = document.getElementById("minePhoneNo").value;
  var callArgs = "[\"" + phoneNo + "\"]"
  var contract = {
    "function" : callFunction,
    "args" : callArgs,
  }

  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
    cbmyStorySearch(resp); 
    $("#load_mystory_loading").hide();

  }) .catch(function(err) {
    alert("失败ddd");
    $("#load_mystory_loading").hide();
  })
}

//return of search,
function cbmyStorySearch(resp) {
  var result = resp.result;
  console.log("return of rpc call: " + JSON.stringify(result));
  var resultStringify = JSON.stringify(result);

  if (resultStringify.search("Error") !== -1) {
    
    alert("全部加载完毕");
  }
  //  else if (resultStringify.search("null") !== -1) {
  //   alert("购买成功,购买单号读取失败,请在'我的'模块中重新读取");
  // }
   else {  //搜索成功
    result = JSON.parse(resultStringify);
    result = JSON.parse(result);
    // result = JSON.parse(result);
    console.log("result = " + result);

    var html = $(".all-status-mystories").html();

    for (var i = 0; i < result.length; i++) {
      var obj = result[i];
      var title = obj["title"];
      var value = obj["value"];
      html += '<div class="row clearfix"> <div class="col-md-12 column"> <strong>' + title + '</strong> <p>'+ value +'</p> </div> </div> </div> <hr>';
      }
    $('.all-status-mystories').html(html);
  }
}


// var isMobile;
var browser = {
  versions: function() {
      var u = navigator.userAgent,
          app = navigator.appVersion;
      return { //移动终端浏览器版本信息
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
          iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
          weixin: u.indexOf('MicroMessenger') > -1, //是否微信   
          qq: u.match(/\sQQ/i) !== null//u.indexOf("MQQBrowser")>-1  //是否QQ 
      };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}





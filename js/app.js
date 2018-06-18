var nebulas = require("nebulas"),
    NebPay = require("nebpay"),
    Account = nebulas.Account,
    HttpRequest = nebulas.HttpRequest,
    Neb = nebulas.Neb;
    
var nasConfig = {
  mainnet: {
      chainID:'1',
      contractAddress: "n1pJVYCVACc2Pzo21db2KGSTbKQgsVmqjd6",
      host: "https://mainnet.nebulas.io",
      payHost: "https://pay.nebulas.io/api/mainnet/pay"
  },
  testnet: {
      chainID:'1001',
      contractAddress: "n1pC3472wgGeynXTYt9CRXNZVZ3vCfA6TNE",
      host: "https://testnet.nebulas.io",
      payHost: "https://pay.nebulas.io/api/pay"
  }
}
var neb = new Neb();
// var chainInfo=nasConfig.mainnet;
var chainInfo=nasConfig.testnet;

neb.setRequest(new HttpRequest(chainInfo.host));
var nasApi = neb.api;

var nebPay = new NebPay();

var account;
var isMobile;
var dappAddress=chainInfo.contractAddress;
var nonce = "0";
var gas_price = "1000000";
var gas_limit = "2000000";

// var callbackUrl = NebPay.config.mainnetUrl; //在主网查询(默认值)
var callbackUrl = NebPay.config.testnetUrl; //在测试网查询
var serialNumber;
var intervalQuery;  //定时查询交易结果  



function getPerson() {
  var from = Account.NewAccount().getAddressString();
  var value = "0";
  var callFunction = "getPerson";
  var phoneNo = "0001";
  var callArgs = "[\""  + phoneNo + "\"]"
  var contract = {
    "function" : callFunction,
    "args" : callArgs,
  }

  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
    // cbSearch(resp);
    console.log("resp = " + resp);
  }) .catch(function(err) {
    alert("购买成功,购买单号读取失败,请在'我的'模块中重新读取");
  })
}


function getInfos() {

  $("#load_loading").show();
  var from = Account.NewAccount().getAddressString();
  var value = "0";
  var callFunction = "getInfos";
  var limit = "10";
  var offset = "0";
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
    
    alert("购买成功,购买单号读取失败,请在'我的'模块中重新读取");
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

    for (var i = 0; i < result.length; i++) {
      var obj = result[i];
      var content = obj["content"];
      var title = content["title"];
      var value = content["value"];

      html += '<div class="row"> <div class="row clearfix"> <div class="col-md-4 column"> <img src="img/jianghu2.jpg" width="60" height="60" /> </div> </div> <strong style="margin-top: 15px">Rick</strong></div>  <div class="row clearfix"> <div class="col-md-12 column"> <strong>' + title + '</strong> <p>'+ value +'</p> </div> </div> </div> <hr>';

      // console.log("obj = " + title);
    }

    $('.all-status').html(html);
  }
}

window.addEventListener('load', function () {
  console.log("ddd");
  if(typeof(webExtensionWallet) === "undefined"){

  }else{
    console.log("start");
    getInfos();
  }
});






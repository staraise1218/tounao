<?php

namespace app\mobile\controller;
use think\Db;
require_once "./plugins/weixin/lib/WxPay.Api.php";
require_once "./plugins/weixin/WxPay.JsApiPay.php";
require_once "./plugins/weixin/WxPay.Config.php";

class Pay {

	// 统一下单 unifiedOrder
    public function unifiedOrder($order_sn){
        $openId = 'okXuBs-fUupkipNeLpFCjEfggfxc';
    	//②、统一下单
        $input = new \WxPayUnifiedOrder();
        $input->SetBody("test");
        $input->SetAttach("test");
        $input->SetOut_trade_no("sdkphp".date("YmdHis"));
        $input->SetTotal_fee("1");
        $input->SetTime_start(date("YmdHis"));
        $input->SetTime_expire(date("YmdHis", time() + 600));
        $input->SetGoods_tag("test");
        $input->SetNotify_url("http://paysdk.weixin.qq.com/notify.php");
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openId);
        $config = new \WxPayConfig();
        $order = WxPayApi::unifiedOrder($config, $input);
        return json_encode($order);
    }
}
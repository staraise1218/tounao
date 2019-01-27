<?php

namespace app\mobile\controller;

use think\Controller;
use think\Db;
use app\mobile\Logic\WeixinPublicLogic;

class Weixin {

	// 第一步获取 code
    public function get_code(){
    	// getcode
    	$WeixinPublicLogic = new WeixinPublicLogic();
    	$authUrl = $WeixinPublicLogic->getAuthUrl();

    	response_success(array('authUrl'=>$authUrl));
    }
}
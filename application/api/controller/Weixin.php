<?php

namespace app\api\controller;

use think\Controller;
use think\Db;
use app\common\Logic\WeixinPublicLogic;

class Weixin extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = '*';

		parent::__construct();
	}

	public function configAuth(){
		$param = I('get.');
		p($param);
	}

	// 第一步获取 code
    public function get_code(){
    	// getcode
    	$WeixinPublicLogic = new WeixinPublicLogic();
    	$authUrl = $WeixinPublicLogic->getAuthUrl();

    	response_success(array('authUrl'=>$authUrl));
    }
}
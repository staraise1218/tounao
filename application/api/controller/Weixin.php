<?php

namespace app\api\controller;

use think\Controller;
use think\Db;
use app\common\logic\WeixinPublicLogic;

class Weixin extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = '*';

		parent::__construct();
	}

	/**
	 * [configAuth 公众号配置url 验证消息来自微信服务器]
	 * @return [type] [description]
	 */
	public function configAuth(){
		$echoStr = $_GET["echostr"];
		if($this->checkSignature()){
            echo $echoStr;
            exit;
        }
		
	}

	// 第一步获取 code
    public function get_code(){
    	// getcode
    	$WeixinPublicLogic = new WeixinPublicLogic();
    	$authUrl = $WeixinPublicLogic->getAuthUrl();

    	response_success(array('authUrl'=>$authUrl));
    }

    private function checkSignature()
    {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];    
                
        $token = 'tounao';
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr);
        $tmpStr = implode( $tmpArr );
        $tmpStr = sha1( $tmpStr );
        
        if( $tmpStr == $signature ){
            return true;
        }else{
            return false;
        }
    }
}
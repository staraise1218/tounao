<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\SmsLogic;

class Common extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}


    /**
     * [sendMobleCode 发送手机验证码]
     * @param [scene 1 注册 2 找回密码, 3 修改手机号]
     * @return [type] [description]
     */
    public function sendMobileCode(){
        $mobile = I('mobile');
        $scene = I('scene', 1);


        // 检测手机号
        if(check_mobile($mobile) == false) response_error('', '手机号格式错误');

        // 注册场景检测是否注册
        if($scene == '3'){
            $count = Db::name('users')->where("mobile=$mobile")
            	->count();
            if($count) response_error('', '该手机号已注册');
        }

        $SmsLogic = new SmsLogic();
        $code = $SmsLogic->send($mobile, $scene, $error);
        if($code != false){
            response_success(array('code'=>$code), '发送成功');
        } else {
            response_error('', $error);
        }
    }

}
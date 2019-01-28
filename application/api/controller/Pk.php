<?php

namespace app\api\controller;

use think\Db;
use GatewayClient\Gateway;

require_once '/GatewayClient/Gateway.php';

class Pk extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function invite(){
		$user_id = input('user_id');
		$to_user_id = I('to_user_id');

		if(!Gateway::isUidOnline($user_id)) response_error('', '您不在线');
		if(!Gateway::isUidOnline($to_user_id)) response_error('', '对方不在线');

		// 获取用户信息
		$user = Db::name('users')->where('user_id', $user_id)->find();

		$result  = Db::name('room')->insert(array(
			'user_id' => $user_id,
			'to_user_id' => $to_user_id,
			'createtime' => time(),
		));

		if($result) {
			$message = json_encode(array(
				'action'=>'invite',
				'message' => $user['nickname'].'邀请您PK',
			));
			Gateway::sendToUid($to_user_id, $message);
			response_success();
		} else {
			response_error();
		}
	}

}
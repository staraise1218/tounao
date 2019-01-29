<?php

namespace app\api\controller;

use think\Db;
use GatewayClient\Gateway;

require_once './GatewayClient/Gateway.php';

class Pk extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function invite(){
		$user_id = I('user_id');
		$to_user_id = I('to_user_id');

		// if(!Gateway::isUidOnline($user_id)) response_error('', '您不在线');
		// if(!Gateway::isUidOnline($to_user_id)) response_error('', '对方不在线');

		// 获取用户信息
		$user = Db::name('users')->where('user_id', $user_id)->find();

		$room_id  = Db::name('room')->insertGetId(array(
			'user_id' => $user_id,
			'to_user_id' => $to_user_id,
			'createtime' => time(),
		));

		if($room_id) {
			$message = json_encode(array(
				'action'=>'invite',
				'user_id' => $user_id,
				'room_id' => $room_id,
				'message' => $user['nickname'].'邀请您PK',
			));
			Gateway::sendToUid($to_user_id, $message);

			// 获取问题列表
			// $knowledgeList = Db::name('knowledge')
			// 	->where('is_open', 1)
			// 	->where('is_delete', 0)
			// 	->order('id desc')
			// 	->limit(5)
			// 	->field('title, a, b, c, d, answer')
			// 	->select();
			// foreach ($knowledgeList as $key => $value) {
			// 	# code...
			// }
			// $result['knowledgeList'] = $knowledgeList;
			response_success($knowledgeList);
		} else {
			response_error();
		}
	}

	// 进入房间
	public function intoRoom(){
		$room_id = I('room_id');
		$to_user_id = I('to_user_id');

		$room = Db::name('room')->where('id', $room_id)->find();
		if($room['user_id_status'] == 2) response_error(array('status'=>1), '对方已退出');
		if($room['createtime']+20 > time()) response_error(array('status'=>2), '等待超时');

		$userinfo = Db::name('users')
			->where('user_id', $room['user_id'])
			->field('user_id, head_pic, nickname')
			->find();
		$touserinfo = Db::name('users')
			->where('user_id', $to_user_id)
			->field('user_id, head_pic, nickname')
			->find();

		$result['userinfo'] = $userinfo;
		$result['touserinfo'] = $touserinfo; 

		response_success($result);
	}

}
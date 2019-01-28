<?php

namespace app\api\controller;

use think\Db;

class Pk extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function invite(){
		$user_id = input('user_id');
		$to_user_id = I('to_user_id');
		
		response_success($list);
	}

}
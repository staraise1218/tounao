<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\GeographyLogic;

class Index extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function index(){
		$page = I('page');
		$searchNickname = I('searchNickname');

		$where = '1=1';
		if($searchKeyword) $where['nickname'] = array('like' => "'%{$searchNickname}%'");
		$list = Db::name('users')
			->where($where)
			->page($page)
			->limit(10)
			->field('user_id, nickname, head_pic, province_code, city_code, school, location')
			->select();

		if(is_array($list) && !empty($list)){
			foreach ($list as &$item) {
				$item['province_city'] = '北京市朝阳区';
				unset($item['province_code']);
				unset($item['city_code']);
			}
		}

		response_success($list);
	}

}
<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\GeographyLogic;

class User extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function myLesson(){
		$user_id = $this->user_id;
		$page = I('page/d', 1);

		$list = Db::name('lesson_order')->alias('lo')
			->join('lesson l', 'lo.lesson_id=l.id')
			->where('lo.user_id', $user_id)
			->where('lo.paystatus', 1)
			->page($page)
			->limit(10)
			->field('lo.lesson_id, lo.price, lo.paytime, title, thumb')
			->select();

		response_success($list);
	}

	public function collectLesson(){
		$user_id = $this->user_id;
		$page = I('page/d', 1);

		$list = Db::name('user_collect')->alias('uc')
			->join('lesson l', 'uc.table_id=l.id')
			->where('uc.user_id', $user_id)
			->where('uc.table_name', 'lesson')
			->page($page)
			->limit(10)
			->field('uc.table_id lesson_id, uc.add_time, title, thumb, price')
			->select();

		response_success($list);
	}

	// 取消收藏
	public function cancleCollect(){
		$user_id = $this->user_id;
		$lesson_id = I('lesson_id');
		$table_name = I('table_name');

		if( false !== Db::name('user_collect')
			->where('user_id', $user_id)
			->where('table_name', $table_name)
			->where('table_id', $lesson_id)
			->delete()){
			response_success('', '取消成功');
		} else {
			reponse_error('', '取消失败');
		}
	}
}
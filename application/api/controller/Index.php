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

	public function lessonList(){
		$page = I('page', 1);
		// 获取banner
		$lessonList = Db::name('lesson')
			->where('is_open', 1)
			->where('is_delete', 0)
			->page($page)
			->limit(10)
			->field('id, title, thumb, price')
			->select();

		if(is_array($lessonList) && !empty($lessonList)){
			foreach ($lessonList as &$item) {
				$item['url'] = U('mobile/lesson/detail', array('id'=>$item['id']));
			}
		}

		response_success($lessonList);
	}

}
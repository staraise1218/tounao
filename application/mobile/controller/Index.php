<?php

namespace app\mobile\controller;

use think\Controller;
use think\Db;

class Index extends Base{

    public function index(){
    	
    	// 获取banner
		$bannerList = Db::name('ad')
			->where('pid', 1)
			->where('enabled', 1)
			->field('ad_name, ad_link, ad_code')
			->order('orderby desc, ad_id desc')
			->select();

		// 获取常规课程
		$lessonList = Db::name('lesson')
			->where('is_open', 1)
			->where('is_delete', 0)
			->limit(4)
			->field('id, title, thumb, price')
			->select();

		$this->assign('bannerList', $bannerList);
		$this->assign('lessonList', $lessonList);
    	return $this->fetch('index');
    }
}
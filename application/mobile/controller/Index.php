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


		$this->assign('bannerList', $bannerList);
		// $this->assign('lessonList', $lessonList);
    	return $this->fetch('index');
    }
}
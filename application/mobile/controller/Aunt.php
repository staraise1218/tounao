<?php

namespace app\mobile\controller;

use think\Controller;
use think\Db;

class Aunt extends Base{

    public function index(){
    	// 获取banner
		$bannerList = Db::name('ad')
			->where('pid', 2)
			->where('enabled', 1)
			->field('ad_name, ad_link, ad_code')
			->order('orderby desc, ad_id desc')
			->select();

		// 获取阿姨分类
		$auntCategoryList = Db::name('aunt_category')->select();
		// 获取阿姨列表
		$auntList = Db::name('aunt')
			->where('is_delete', 0)
			->limit(10)
			->select();
		if(is_array($auntList) && !empty($auntList)){
			foreach ($auntList as &$item) {
				$item['tag'] = $item['tag'] ? explode(',', rtrim($item['tag'], ',')) : '';
				$item['url'] = U('mobile/aunt/detail', array('id'=>$item['id']));
			}
		}

		$this->assign('bannerList', $bannerList);
		$this->assign('auntCategoryList', $auntCategoryList);
		$this->assign('auntList', $auntList);

    }

    public function detail(){
    	$id = I('id');

		$info = Db::name('aunt')
			->where('id', $id)
			->where('is_delete', 0)
			->find();

		$this->assign('info', $info);
    	return $this->fetch();
    }
}
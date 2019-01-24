<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\GeographyLogic;

class Aunt extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function index(){
		// 获取banner
		$bannerList = Db::name('ad')
			->where('pid', 2)
			->where('enabled', 1)
			->field('ad_name, ad_link, ad_code')
			->order('orderby desc, ad_id desc')
			->select();

		$result['bannerList'] = $bannerList;
		// 获取阿姨分类
		$auntCategoryList = Db::name('aunt_category')->select();
		$result['auntCategoryList'] = $auntCategoryList;
		// 获取阿姨列表
		/*$auntList = Db::name('aunt')
			->where('is_delete', 0)
			->limit(10)
			->select();
		if(is_array($auntList) && !empty($auntList)){
			foreach ($auntList as &$item) {
				$item['tag'] = $item['tag'] ? explode(',', rtrim($item['tag'], ',')) : '';
			}
		}

		$result['auntList'] = $auntList;*/
		
		response_success($result);
	}

	// 获取阿姨列表
	public function getlist(){
		$cat_id = input('cat_id');
		$page = input('page', 1);
		if($page <= 0) $page = 1;

		$where['is_delete'] = 0;
		if($cat_id) $where['cat_id'] = $cat_id;

		$list = Db::name('aunt')
			->where($where)
			->limit(10)
			->page($page)
			->field('id, title, thumb, leixing, tag, description')
			->select();

		if(is_array($list) && !empty($list)){
			foreach ($list as &$item) {
				$item['tag'] = $item['tag'] ? explode(',', rtrim($item['tag'], ',')) : '';
				$item['url'] = U('mobile/aunt/detail', array('id'=>$item['id']));
			}
		}

		response_success($list);
	}

	public function detail(){
		$id = I('id');

		$info = Db::name('aunt')
			->where('id', $id)
			->where('is_delete', 0)
			->find();
		response_success($info);
	}

}
<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\GeographyLogic;
use think\Image;

class User extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function userinfo(){
		$user_id = I('user_id');

		$userinfo = Db::name('users')
			->where('user_id', $user_id)
			->where('is_lock', 0)
			->field('head_pic, nickname, grade_id, goldcoin, school, school_display')
			->find();

		// 获取年级
		if($userinfo['grade_id']){
			$grade = Db::name('grade')->where('id', $userinfo['grade_id'])->find();
			$userinfo['grade'] = $grade['title'];
		} else {
			$userinfo['grade'] = '';
		}
		unset($userinfo['grade_id']);
		$userinfo['head_pic'] = headPic($userinfo['head_pic']);


		response_success($userinfo);
	}

	public function gradeList(){
		$gradeList = Db::name('grade')
			->where('is_open', 1)
			->where('is_delete', 0)
			->field('id, title')
			->select();

		response_success($gradeList);
	}

    // 修改头像
    public function changeHeadPic(){
        $user_id = I('user_id');

        $uploadPath = UPLOAD_PATH.'head_pic/';

        $FileLogic = new FileLogic();
        $result = $FileLogic->uploadSingleFile('file', $uploadPath);
        if($result['status'] == '1'){
            $fullPath = $result['fullPath'];

            Db::name('users')->update(array('user_id'=>$user_id, 'head_pic'=>$fullPath));

            $resultdata = array('head_pic'=>'http://tounao.staraise.com.cn'.$fullPath);
            response_success($resultdata, '上传成功');
            
        } else {
            response_error('', '提交失败');
        }
    }

    public function changeField(){
    	$user_id = I('user_id');
        $field = input('post.field');
        $fieldValue = input('post.fieldValue');

        if(!in_array($field, array('nickname', 'grade_id', 'school', 'school_display'))) response_error('', '不被允许的字段');

        if($field == 'nickname'){
            if(mb_strlen($fieldValue) > 6 || mb_strlen($fieldValue) < 2){
                response_error('', '昵称长度在2-6个字之间');
            }
        }

        Db::name('users')->where('user_id', $this->user_id)->update(array($field=>$fieldValue));
        response_success('', '修改成功');
    }
}
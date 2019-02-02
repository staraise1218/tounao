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
			unset($userinfo['grade']);
		}

		response_success($userinfo);
	}

	public function gradeList(){
		$gradeList = Db::name('grade')
			->where('is_open', 1)
			->where('is_delete', 0)
			->select();

		response_success($gradeList);
	}

    /**
     * [uploadFile 上传头像/认证视频 app 原生调用]
     * @param [type] $[type] [文件类型 head_pic 头像 auth_video 视频认证]
     * @param  $[action] [ 默认 add 添加 edit 修改]
     * @return [type] [description]
     */
    public function changeHeadPic(){
        $user_id = $this->user_id;

        $uploadPath = UPLOAD_PATH.'head_pic/';

        $FileLogic = new FileLogic();
        $result = $FileLogic->uploadSingleFile('file', $uploadPath);
        if($result['status'] == '1'){
            $fullPath = $result['fullPath'];

            Db::name('users')->update(array('user_id'=>$user_id, 'head_pic'=>$fullPath));

            $resultdata = array('head_pic'=>$fullPath);
            response_success($resultdata, '上传成功');
            
        } else {
            response_error('', '提交失败');
        }
    }

    public function changeField(){
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
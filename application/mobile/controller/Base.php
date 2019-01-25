<?php

namespace app\mobile\controller;

use think\Controller;

class Base extends Controller{

    public function __construct(){
        
    	parent::__construct();

    	// $this->checkLogin();
    }

    public function checkLogin(){

    	if (session('?user')) {
            $session_user = session('user');
            $select_user = M('users')->where("user_id", $session_user['user_id'])->find();
            $oauth_users = M('OauthUsers')->where(['user_id'=>$session_user['user_id']])->find();
            empty($oauth_users) && $oauth_users = [];
            $user =  array_merge($select_user,$oauth_users);
            session('user', $user);  //覆盖session 中的 user
            $this->user = $user;
            $this->user_id = $user['user_id'];
            $this->assign('user', $user); //存储用户信息

        } else {

        	header("Location:/index.php/mobile/weixin/get_code");
        	die();
        }
    }
}
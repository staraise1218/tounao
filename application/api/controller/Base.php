<?php

namespace app\api\controller;
use think\Controller;

class Base extends Controller {
    protected $method = 'GET';
    protected $noLoginController;

    public function __construct(){
        header("Access-Control-Allow-Origin: *"); // 允许跨域
        
        parent::__construct();
        $this->noLoginController = array('Git');

        // 请求写入log
        $this->requestToLog();
        $this->checkMethod();

        if (session('?user')) {
            $session_user = session('user');
            $select_user = M('users')->where("user_id", $session_user['user_id'])->find();
            $oauth_users = M('OauthUsers')->where(['user_id'=>$session_user['user_id']])->find();
            empty($oauth_users) && $oauth_users = [];
            $user =  array_merge($select_user,$oauth_users);
            session('user', $user);  //覆盖session 中的 user
            $this->user = $user;
            $this->user_id = $user['user_id'];

        } else {
            if( ! in_array(CONTROLLER_NAME, $this->noLoginController)){
                response_error('', '未登录');
            }
        }
    }

    protected function checkMethod(){
        // 允许的请求方式
        $allow_method = strtoupper($this->method);

        // 当前请求方式
        $method = $this->request->method();

        if(!($method == $allow_method)) {
            response_error('', '不被允许的请求');
        }
    }

    protected function requestToLog(){
        $pathinfo = $this->request->pathinfo();
        $method = $this->request->method();
        $param = $this->request->param();

        if($_FILES){
            $param = array_merge($param, $_FILES);
        }

        $data = "\r\n".date('Y-m-d H:i:s')." ".$pathinfo." method: {$method} \r\n param: ".var_export($param, true);

        // $logPath = ROOT_PATH.'/runtime/log/'.date('Ymd').'/requestlog.txt';

        file_put_contents('runtime/log/request.log', $data, FILE_APPEND);
    }
}
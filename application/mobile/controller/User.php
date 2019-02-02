<?php

namespace app\mobile\controller;

use think\Controller;
use think\Db;
use app\api\logic\FileLogic;

class User extends Base{

    public function index(){
    	
    	return $this->fetch();
    }

    public function modify(){
    	return $this->fetch();
    }

    public function changeMobile(){
        $mobile = input('post.mobile');
        $code = input('post.code');
        // 判断手机号格式
        if(!check_mobile($mobile)) response_error('', '手机号格式错误');
        $smslog = Db::name('sms_log')->where('mobile', $mobile)->where('scene', 3)->order('id desc')->find();

        if(empty($smslog) || $smslog['code'] != $code) response_error('', '验证码错误');

        Db::name('users')->where('user_id', $this->user_id)->update(array('mobile'=>$mobile));
        response_success('', '修改成功');
    }

       //php验证身份证号码是否正确函数
    private function is_idcard( $id ){ 
        $id = strtoupper($id); 
        $regx = "/(^\d{15}$)|(^\d{17}([0-9]|X)$)/"; 
        $arr_split = array(); 
        if(!preg_match($regx, $id)){ 
            return FALSE; 
        } 
        //检查15位
        if(15==strlen($id)){ 
            $regx = "/^(\d{6})+(\d{2})+(\d{2})+(\d{2})+(\d{3})$/"; 
            @preg_match($regx, $id, $arr_split); 
            //检查生日日期是否正确 
            $dtm_birth = "19".$arr_split[2] . '/' . $arr_split[3]. '/' .$arr_split[4]; 
            if(!strtotime($dtm_birth)){ 
                return FALSE; 
            }else{ 
                return TRUE; 
            } 
        }else{ 
            //检查18位
            $regx = "/^(\d{6})+(\d{4})+(\d{2})+(\d{2})+(\d{3})([0-9]|X)$/"; 
            @preg_match($regx, $id, $arr_split); 
            $dtm_birth = $arr_split[2] . '/' . $arr_split[3]. '/' .$arr_split[4]; 
            //检查生日日期是否正确 
            if(!strtotime($dtm_birth)){ 
                return FALSE; 
            }else{ 
                //检验18位身份证的校验码是否正确。 
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
                $arr_int = array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
                $arr_ch = array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
                $sign = 0; 
                for ( $i = 0; $i < 17; $i++ ) 
                { 
                    $b = (int) $id{$i}; 
                    $w = $arr_int[$i]; 
                    $sign += $b * $w; 
                } 
                $n = $sign % 11; 
                $val_num = $arr_ch[$n]; 
                if ($val_num != substr($id,17, 1)){ 
                    return FALSE; 
                }else{ 
                    return TRUE; 
                } 
            } 
        } 
    }

    public function apply(){
        if(IS_POST){
            $data = array(
                'user_id' => $this->user_id,
                'exam_date' => input('post.exam_date'),
                'exam_content_id' => input('post.exam_content_id'),
                'province_id' => input('post.province_id'),
                'city_id' => input('post.city_id'),
                'location_id' => input('post.location_id'),
                'remark' => input('remark'),
                'add_time' => time(),
            );

            if(Db::name('exam_apply')->insert($data)){
                die(json_encode(array('code' => 200)));
            } else {
                die(json_encode(array('code'=>400)));
            }
        }

        // 获取考试名称
        $examName = Db::name('exam_content')
            ->where('is_open', 1)
            ->where('is_delete', 0)
            ->order('id desc')
            ->select();

        // 获取region
        $region = Db::name('region')
            ->where('parent_id', 0)
            ->select();



        $this->assign('examName', $examName);
        $this->assign('region', $region);
    	return $this->fetch();
    }

    public function ajaxGetRegion(){
        $region_id = I('region_id');

        $region = Db::name('region')->where('parent_id', $region_id)->select();

        response_success($region);
    }
}
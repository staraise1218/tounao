<?php
/**
 * 短信验证码类
 */
namespace app\api\logic;
require_once PLUGIN_PATH . 'aliyunSmsSdk/vendor/autoload.php';

use Aliyun\Core\Config;
use Aliyun\Core\Profile\DefaultProfile;
use Aliyun\Core\DefaultAcsClient;
use Aliyun\Api\Sms\Request\V20170525\SendSmsRequest;
use Aliyun\Api\Sms\Request\V20170525\SendBatchSmsRequest;
use Aliyun\Api\Sms\Request\V20170525\QuerySendDetailsRequest;
use think\Db;

// 加载区域结点配置
Config::load();



class SmsLogic {

    private $day_count = 10; // 一天限制次数
    private $expire = 600; // 10分钟内有效

    static $acsClient = null;
    /**
     * [send 发送验证码对外接口]
     * @param  [type] $mobile [手机号]
     * @param  [type] $scene  [场景 1 注册 2 找回密码]
     * @param  [type] &$error [返回错误信息]
     * @return [type]         [description]
     */
    public function send($mobile, $scene, &$error){
        
        
        // 检测发送次数
        $day_time_start = strtotime(date('Y-m-d'));
        $day_time_end = $day_time_start + 3600*24;
        $count = Db::name('SmsLog')
            ->where('mobile', $mobile)
            ->where('add_time', ['>', $day_time_start], ['<', $day_time_end])
            ->count();

        if($count >= $this->day_count){
            $error = '您的次数已超限';
            return false;
        }

        $code = rand(100000, 999999);
        $data = array(
            'mobile' => $mobile,
            'code' => $code,
            'scene' => $scene,
            'add_time' => time(),
        );

        $smsLogid = Db::name('sms_log')->insertGetId($data);
return $code;
        // 执行短信网关发送 12269890032
        // $result = $this->sendSms($mobile, $code);

        // if($result->Code == 'OK'){
        //     Db::name('sms_log')->where("id=$smsLogid")->update(array('status'=>'1'));
        //     return $code;
        // } else {
        //     $error = '发送失败';
        //     return false;
        // }
    }

    /**
     * 发送短信
     * @return stdClass
     */
    public static function sendSms($mobile, $code) {
        return (object)array('Code'=>'OK');
        
        // 初始化SendSmsRequest实例用于设置发送短信的参数
        $request = new SendSmsRequest();

        //可选-启用https协议
        //$request->setProtocol("https");

        // 必填，设置短信接收号码
        $request->setPhoneNumbers($mobile);

        // 必填，设置签名名称，应严格按"签名名称"填写，请参考: https://dysms.console.aliyun.com/dysms.htm#/develop/sign
        $request->setSignName("遇见好时光");

        // 必填，设置模板CODE，应严格按"模板CODE"填写, 请参考: https://dysms.console.aliyun.com/dysms.htm#/develop/template
        $request->setTemplateCode("SMS_141965192");

        // 可选，设置模板参数, 假如模板中存在变量需要替换则为必填项
        $request->setTemplateParam(json_encode(array(  // 短信模板中字段的值
            "code"=>$code,
            "product"=>"dsd"
        ), JSON_UNESCAPED_UNICODE));

        // 可选，设置流水号
        $request->setOutId("yourOutId");

        // 选填，上行短信扩展码（扩展码字段控制在7位或以下，无特殊需求用户请忽略此字段）
        $request->setSmsUpExtendCode("1234567");

        // 发起访问请求
        $acsResponse = static::getAcsClient()->getAcsResponse($request);

        return $acsResponse;
    }

    /**
     * [checkCode 检测手机验证码是否正确]
     * @param  [type] $mobile [description]
     * @param  [type] $code   [description]
     * @param  [type] $scene  [description]
     * @param  [type] &$error [description]
     * @return [type]         [description]
     */
    public function checkCode($mobile, $code, $scene, &$error){
        $smsLog = Db::name('SmsLog')
            ->where("mobile=$mobile and scene=$scene")
            ->order('id desc')
            ->find();

        if(!$smsLog){
            $error = '手机验证码错误';
            return false;
        }
        if($smsLog['code'] != $code){
            $error = '手机验证码错误';
            return false;
        }

        if(time() > ($smsLog['add_time'] + $this->expire)){
            $error = '验证码已失效';
            return false;
        }

        return true;
    }


    /**
     * 取得AcsClient
     *
     * @return DefaultAcsClient
     */
    public static function getAcsClient() {
        //产品名称:云通信流量服务API产品,开发者无需替换
        $product = "Dysmsapi";

        //产品域名,开发者无需替换
        $domain = "dysmsapi.aliyuncs.com";

        // TODO 此处需要替换成开发者自己的AK (https://ak-console.aliyun.com/)
        $accessKeyId = "LTAIoEgoBushEbTG"; // AccessKeyId

        $accessKeySecret = "6vw9idElHspORFkKANuMh6IPQbqlis"; // AccessKeySecret

        // 暂时不支持多Region
        $region = "cn-hangzhou";

        // 服务结点
        $endPointName = "cn-hangzhou";


        if(static::$acsClient == null) {

            //初始化acsClient,暂不支持region化
            $profile = DefaultProfile::getProfile($region, $accessKeyId, $accessKeySecret);

            // 增加服务结点
            DefaultProfile::addEndpoint($endPointName, $region, $product, $domain);

            // 初始化AcsClient用于发起请求
            static::$acsClient = new DefaultAcsClient($profile);
        }
        return static::$acsClient;
    }
}
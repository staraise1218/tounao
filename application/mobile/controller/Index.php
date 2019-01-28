<?php

namespace app\mobile\controller;

use think\Controller;
use think\Db;

class Index extends Base{

    public function index(){

    	return $this->fetch('index');
    }
}
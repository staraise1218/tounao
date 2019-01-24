<?php

namespace app\mobile\controller;

use think\Controller;

class Base extends Controller{

    public function __construct(){
        
    	parent::__construct();

    	// $this->checkLogin();
    }
}
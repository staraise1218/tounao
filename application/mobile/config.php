<?php
return $home_config = [
    // +----------------------------------------------------------------------
    // | 模板设置
    // +----------------------------------------------------------------------
	//默认错误跳转对应的模板文件
	'dispatch_error_tmpl' => 'public:dispatch_jump',
	//默认成功跳转对应的模板文件
	'dispatch_success_tmpl' => 'public:dispatch_jump', 
	'view_replace_str'  =>  [
        '__PUBLIC__'=>'/public',
        '__STATIC__' => '/application/mobile/view/static',
        '__ROOT__'=>''
    ]
];
?>
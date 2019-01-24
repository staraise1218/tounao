<?php

namespace app\admin\controller;

use think\Page;
use think\Paginator;

class Exam extends Base {
    
    public function contentList(){
        $list = M('exam_content')
            ->where('is_delete', 0)
            ->order('id desc')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/exam/contentList')]);

        $this->assign('list',$list);// 赋值数据集
        
        return $this->fetch();
    }

    public function contentAdd(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['name']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['name' =>'名称不能为空']]);

            if(M('exam_content')->insert($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }

        return $this->fetch();
    }

    public function contentEdit(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['name']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['name' =>'名称不能为空']]);

            $id = $data['id'];

            if(M('exam_content')->where('id', $id)->save($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }
        $id = I('id');
        $info = M('exam_content')->where('id', $id)->find();


        $this->assign('info', $info);
        return $this->fetch();
    }

    public function delContent(){
        $id = I('id');

        if(false !== M('exam_content')->where('id', $id)->update(array('is_delete', 1))){
            $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
        } else {
            $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
        }
    }
}
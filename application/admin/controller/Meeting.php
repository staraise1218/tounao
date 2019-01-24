<?php

namespace app\admin\controller;

use think\Page;

class Meeting extends Base {

    public function index(){
        $page = empty($_REQUEST['p']) ? 1 : $_REQUEST['p'];
        $size = empty($_REQUEST['size']) ? 20 : $_REQUEST['size'];
        
        $where = " is_delete = 0 ";
        $keywords = trim(I('keywords'));
        $keywords && $where.=" and title like '%$keywords%' ";
       
        $list = M('meeting')->where($where)->order('id desc')
            ->page($p)
            ->limit($size)
            ->select();
        $count = M('meeting')->where($where)->count();// 查询满足要求的总记录数
        $pager = new Page($count,$size);// 实例化分页类 传入总记录数和每页显示的记录数


        $this->assign('list',$list);// 赋值数据集
        $this->assign('pager',$pager);// 赋值分页输出        
        
        return $this->fetch();
    }

    public function add(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['title']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['title' =>'标题不能为空']]);

            $data['createtime'] = time();
            if(M('meeting')->insert($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }
        return $this->fetch();
    }

    public function edit(){
        if($this->request->isPost()){
            $id = I('id');
            $data = I('post.');
            if(trim($data['title']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['title' =>'标题不能为空']]);

            if(M('meeting')->where('id', $id)->update($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }
        $id = I('id');
        $info = M('meeting')->where('id', $id)->find();
        $this->assign('info', $info);
        return $this->fetch();
    }

    public function del(){
        $id = I('id');

        if(false !== M('meeting')->where('id', $id)->update(array('is_delete'=>1))){
            $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
        } else {
            $this->ajaxReturn(['status' => 0, 'msg' => '操作失败']);
        }
    }
    
    public function enrollList(){
        $page = empty($_REQUEST['p']) ? 1 : $_REQUEST['p'];
        $meeting_id = I('meeting_id');
        $keywords = trim(I('keywords'));

        $where = '1=1';
        $meeting_id &&  $where .= " and meeting_id=$meeting_id";
        $keywords && $where.=" and title like '%$keywords%' ";

        $list = M('meeting_enroll')
            ->where($where)
            ->order('id desc')
            ->page($page)
            ->limit(20)
            ->select();

        $count = M('meeting_enroll')->where($where)->count();// 查询满足要求的总记录数
        $pager = new Page($count, 20);// 实例化分页类 传入总记录数和每页显示的记录数


        $this->assign('list',$list);// 赋值数据集
        $this->assign('pager',$pager);// 赋值分页输出        
        
        return $this->fetch();
    }

    public function enrollDetail(){
        $id = I('id');

        $info = M('meeting_enroll')->alias('me')
            ->join('meeting m', 'me.meeting_id=m.id')
            ->where('me.id', $id)->find();

        $this->assign('info', $info);
        return $this->fetch();
    }
}
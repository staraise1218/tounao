<?php

namespace app\admin\controller;

use think\Page;
use think\Paginator;

class Aunt extends Base {

    public function index(){
        $page = I('page', 1);
        $cat_id = I('cat_id', 0);
        
        $where = "is_delete = 0";
        $keywords = trim(I('keywords'));
        $keywords && $where.=" and p.title like '%$keywords%' ";
        $cat_id && $where .= " and p.cat_id = {$cat_id}";
       
        $list = M('aunt')->alias('p')
            ->join('aunt_category pc', 'p.cat_id=pc.id', 'left')
            ->where($where)
            ->field('p.id, p.title, p.createtime, pc.name category_name')
            ->order('p.id desc')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/aunt/index')]);

        // 获取分类
        $categoryList = M('aunt_category')
            ->order('id desc')
            ->select();


        $this->assign('cat_id',$cat_id);// 
        $this->assign('categoryList',$categoryList);// 
        $this->assign('list',$list);// 赋值数据集
        
        return $this->fetch();
    }

    public function add(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['title']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['title' =>'标题不能为空']]);

            $data['createtime'] = time();
            if(M('aunt')->insert($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }

         // 获取分类
        $categoryList = M('aunt_category')
            ->order('id desc')
            ->select();

        $this->assign('categoryList',$categoryList);
        return $this->fetch();
    }

    public function edit(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['title']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['title' =>'标题不能为空']]);

            $id = $data['id'];

            if(M('aunt')->where('id', $id)->save($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }
        $id = I('id');
        $info = M('aunt')->where('id', $id)->find();

        // 获取分类
        $categoryList = M('aunt_category')
            ->order('id desc')
            ->select();

        $this->assign('info', $info);
        $this->assign('categoryList', $categoryList);
        return $this->fetch();
    }

    public function delPig(){
        $id = I('id');

        if(false !== M('aunt')->where('id', $id)->update(array('is_delete'=>1))){
            $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
        } else {
            $this->ajaxReturn(['status' => 0, 'msg' => '操作失败']);
        }
    }
    
    public function categoryList(){
        $list = M('aunt_category')->order('id desc')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/aunt/categoryList')]);


        $this->assign('list',$list);// 赋值数据集
        
        return $this->fetch();
    }

    public function categoryAdd(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['name']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['name' =>'分类名称不能为空']]);

            if(M('aunt_category')->insert($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }

        return $this->fetch();
    }

    public function categoryEdit(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['name']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['name' =>'分类名称不能为空']]);

            $id = $data['id'];

            if(M('aunt_category')->where('id', $id)->save($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }
        $id = I('id');
        $info = M('aunt_category')->where('id', $id)->find();


        $this->assign('info', $info);
        return $this->fetch();
    }

    public function delCat(){
        $id = I('id');

        // 判断该分类下是否有数据
        $count = M('aunt')->where('cat_id', $id)->count();
        if($count) $this->ajaxReturn(['status'=>0, 'msg'=>'该分类下有数据，不能删除']);

        if(false !== M('aunt_category')->where('id', $id)->delete()){
            $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
        } else {
            $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
        }
    }
}
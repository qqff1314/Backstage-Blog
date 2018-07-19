const express = require('express');
const Classify = require('../controller/classify/classify');
const Check = require('../middlewares/check');
const router = express.Router();

router.get('/list', Classify.list);//分类列表
router.get('/pagelist',Classify.pagelist);//分类下文章数

router.get('/admin/list',Check.checkLogin, Classify.list);//分类列表
router.get('/admin/pagelist', Check.checkLogin,Classify.pagelist);//分类下文章数
router.post('/admin/add', Check.checkLogin,Classify.add);//增加分类
router.post('/admin/del', Check.checkLogin,Classify.del);//删除分类

module.exports = router;

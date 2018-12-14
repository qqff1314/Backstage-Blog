const express = require('express');
const Article =require('../controller/article/article');
const Check = require('../middlewares/check');
const router = express.Router();

router.get('/detail',Article.detail);//详情
router.get('/listSearch',Article.listSearch);//文章筛选

router.get('/admin/detail',Check.checkLogin,Article.detail);//详情
router.get('/admin/listSearch',Check.checkLogin,Article.listSearch);//文章筛选
router.post('/del',  Check.checkLogin,Article.del);//删除
router.post('/add',  Check.checkLogin,Article.add);//添加
router.post('/edit', Check.checkLogin,Article.edit);//修改


module.exports = router;

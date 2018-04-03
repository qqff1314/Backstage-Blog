const express = require('express');
const Article =require('../controller/article/article');
const Check = require('../middlewares/check');
const router = express.Router();

router.get('/list',  Article.list);//列表
router.get('/detail',Article.detail);//详情
router.post('/del',  Check.checkAdmin,Article.del);//删除
router.post('/add',  Check.checkAdmin,Article.add);//添加
router.post('/edit', Check.checkAdmin,Article.edit);//修改


module.exports = router;

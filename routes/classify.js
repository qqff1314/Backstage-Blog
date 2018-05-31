const express = require('express');
const Classify = require('../controller/classify/classify');
const Check = require('../middlewares/check');
const router = express.Router();

router.get('/list', Classify.list);//分类列表
router.post('/add', Check.checkAdmin,Classify.add);//增加分类
router.post('/del', Check.checkAdmin,Classify.del);//删除分类
router.get('/pagelist', Check.checkAdmin,Classify.pagelist);//分类下文章数
module.exports = router;

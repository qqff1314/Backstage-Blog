const express = require('express');
const Com = require('../controller/com/com');
const router = express.Router();

router.get('/listSearch', Com.listSearch);//关键字搜索
router.get('/tagSearch', Com.tagSearch);//标签搜索
router.get('/isLogin', Com.isLogin);//判断登录



module.exports = router;

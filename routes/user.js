var express = require('express');
var User = require('../controller/user/user');
var Check = require('../middlewares/check');
var router = express.Router();

router.get('/login', User.login);//登录
router.get('/register', User.register);//注册
router.get('/logout',Check.checkLogin,User.logout);//登出
// router.get('/logout', User.commite);//评论文章
module.exports = router;

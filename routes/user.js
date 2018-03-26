var express = require('express');
var User = require('../controller/user/user');
var check = require('../middlewares/check');
var router = express.Router();

router.get('/login', User.login);//登录
router.get('/register', User.register);//注册
router.get('/logout', User.logout);//登出

module.exports = router;

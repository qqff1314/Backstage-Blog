const express = require('express');
const User = require('../controller/user/user');
const Check = require('../middlewares/check');
const router = express.Router();

router.post('/login', User.login);//登录
router.post('/register', User.register);//注册
router.get('/logout',Check.checkLogin,User.logout);//登出

module.exports = router;

var express = require('express');
var User = require('../controller/user/user');
var check = require('../middlewares/check');
var router = express.Router();

router.get('/login', User.login);


module.exports = router;

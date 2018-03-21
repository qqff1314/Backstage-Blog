var express = require('express');
var Admin = require('../controller/admin/admin');
var check = require('../middlewares/check');
var router = express.Router();

router.get('/login', Admin.login);

// router.get('/admin',check.checkAdmin, Admin.admin);

module.exports = router;

var express = require('express');
var Article =require('../controller/article/article');
var check = require('../middlewares/check');
var router = express.Router();

router.get('/list', Article.list);//列表


module.exports = router;

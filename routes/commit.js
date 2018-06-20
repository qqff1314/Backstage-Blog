var express = require('express');
var Commit = require('../controller/commit/commit');
var Check = require('../middlewares/check');
var router = express.Router();

router.get('/list',Commit.list);
router.get('/replayList',Check.checkLogin,Commit.replayList);//回复评论
router.post('/addCommit',Check.checkLogin,Commit.addCommit);//评论
router.post('/replayCommit',Check.checkLogin,Commit.replayCommit);//回复评论
router.post('/delCommit',Check.checkLogin,Commit.delCommit);//删除评论
router.post('/delReplay',Check.checkLogin,Commit.delReplay);//删除回复


module.exports = router;

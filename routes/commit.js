var express = require('express');
var Commit = require('../controller/commit/commit');
var Check = require('../middlewares/check');
var router = express.Router();

router.post('/addCommit',Commit.addCommit);//评论
router.get('/list',Commit.list);
router.post('/replayCommit',Commit.replayCommit);//回复评论

router.get('/newComment',Check.checkLogin,Commit.newComment);//最新评论
router.post('/adminReplay',Check.checkLogin,Commit.adminReplay);//作者回复
router.get('/replayList',Check.checkLogin,Commit.replayList);//回复列表
router.post('/delCommit',Check.checkLogin,Commit.delCommit);//删除评论
router.post('/delReplay',Check.checkLogin,Commit.delReplay);//删除回复


module.exports = router;

var express = require('express');
var Commit = require('../controller/commit/commit');
var Check = require('../middlewares/check');
var router = express.Router();

router.get('/list',Commit.list);
router.post('/addCommit',Check.checkLogin,Commit.addCommit);//评论
router.post('/replayCommit',Check.checkLogin,Commit.replayCommit);//回复评论
router.post('/delCommit',Check.checkAdmin,Commit.delCommit);//回复评论

module.exports = router;

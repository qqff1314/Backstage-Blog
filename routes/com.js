const express = require('express');
const Com = require('../controller/com/com');
const Check = require('../middlewares/check');
const schedule = require('node-schedule');
const moment = require('moment');//时间控件
const db = require('../models/db');
const router = express.Router();
// 图片上传配制
const multer = require("multer");
const storge = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        let fileformat = (file.originalname).split('.');
        cb(null, file.fieldname+'-'+Date.now()+'.'+fileformat[fileformat.length-1]);
    }
});
const upload = multer({storage: storge});

//每日数据插入
const rule = new schedule.RecurrenceRule();
rule.hour =0;rule.minute =0;rule.second =0;
function scheduleCronstyle(){
    schedule.scheduleJob(rule, function(){
        let Time= moment().format('YYYY-MM-DD').toString();
        db.query("insert into pv(Time,Pv) VALUES('"+Time+"',0)",function(err,data){});
    });
}
scheduleCronstyle();



router.post('/admin/upload',Check.checkLogin,upload.single('file'),Com.upload);
router.get('/pvAdd',Com.pvAdd);
router.get('/pvTotal',Com.pvTotal);

module.exports = router;

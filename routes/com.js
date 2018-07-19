const express = require('express');
const Com = require('../controller/com/com');
const Check = require('../middlewares/check');
const router = express.Router();
// 图片上传
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


router.post('/admin/upload',Check.checkLogin,upload.single('file'),Com.upload);
module.exports = router;

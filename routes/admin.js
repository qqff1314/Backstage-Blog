const express = require('express');
const Admin = require('../controller/admin/admin');
const Check = require('../middlewares/check');
const router = express.Router();

router.post('/login', Admin.login);
router.get('/logout',Check.checkAdmin, Admin.logout);
router.get('/getUserList', Check.checkAdmin,Admin.getUserList);
router.post('/setDisable', Check.checkAdmin,Admin.setDisable);//禁言



module.exports = router;

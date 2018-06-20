const express = require('express');
const Admin = require('../controller/admin/admin');
const Check = require('../middlewares/check');
const router = express.Router();

router.post('/login', Admin.login);
router.get('/logout',Check.checkLogin, Admin.logout);

module.exports = router;

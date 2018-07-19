const express = require('express');
const Message = require('../controller/message/message');
const Check = require('../middlewares/check');
const router = express.Router();

router.post('/add',Message.add);
router.get('/list',Message.list);

router.get('/admin/list',Check.checkLogin,Message.list);
router.post('/admin/del',Check.checkLogin,Message.del);

module.exports = router;

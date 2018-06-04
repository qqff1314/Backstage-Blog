const db = require('../../models/db');
const fs = require('fs');

class Com{
    constructor(){
    }
    upload(req, res, next){
        res.send({
            Status: 200,
            data:{
                Url:'http:'+req.host+':3000/upload/'+req.file.filename,
            },
            Msg: '操作成功',
        });
    }
}
module.exports = new Com();
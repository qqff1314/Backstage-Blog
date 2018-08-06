const db = require('../../models/db');
class Com{
    constructor(){
    }
    upload(req, res){
        res.send({
            Status: 200,
            data:{
                Url:'http://'+req.host+'/upload/'+req.file.filename,
            },
            Msg: '操作成功',
        });
    }
    pvAdd(req, res){
        db.query("UPDATE pv set Pv=Pv+1 WHERE 1 ORDER BY Id DESC LIMIT 1", function (err, data) {
            res.send({
                Status: 200,
                Msg: '操作成功',
            });
        })
    }
    pvTotal(req, res){
        db.query("SELECT SUM(Pv) as Total FROM pv where Pv>0", function (err, data) {
            res.send({
                Status: 200,
                data:data[0].Total||0,
                Msg: '操作成功',
            });
        })
    }
}
module.exports = new Com();
const db = require('../../models/db');

class Com{
    listSearch(req, res, next){
        let {Page,Limit,KeyWord} = req.query;
        if(!Page||!Limit||!KeyWord){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        db.query("select Title,ClassName,ReadNum,Time from article where Title like "+"'%"+KeyWord+"% order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
            res.send({
                Status: 200,
                data:{
                    list:data,
                },
                Msg: '操作成功',
            });
        });
    }
    tagSearch(req, res, next){
        let {Page,Limit,ClassId} = req.query;
        if(!Page||!Limit||!ClassId){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        db.query("select Title,ClassName,ReadNum,Time from article where ClassId =" +ClassId+" order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
            res.send({
                Status: 200,
                data:{
                    list:data,
                },
                Msg: '操作成功',
            });
        });
    }
}
module.exports = new Com();
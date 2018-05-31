const db = require('../../models/db');

class Classify{
    constructor(){
        this.del = this.del.bind(this);
    }
    async list(req, res, next){
        db.query("select Id,ClassName from class", function (err, data) {
            res.send({
                Status: 200,
                data:{
                    list:data,
                },
                Msg: '操作成功',
            });
        })
    }
    pagelist(req, res, next){
        db.query("select ClassId,ClassName,count(ClassId) ClassArticleNum from article group by ClassId", function (err, data) {
            res.send({
                Status: 200,
                data:{
                    list:data,
                },
                Msg: '操作成功',
            });
        })
    }
    add(req , res , next){
        let {ClassName} = req.body;
        if(!ClassName){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        db.query("insert into class(ClassName) values('" + ClassName + "')",
            function (err, data) {
                res.send({
                    Status: 200,
                    Msg: '操作成功',
                });
        })
    }
    async del(req , res , next){
        let {Id} = req.body;
        if(!Id){
            res.send({
                Status: 201,
                Msg: 'ID错误',
            });
            return;
        }
        try{
            await this.delClass(Id);
            res.send({
                Status: 200,
                Msg: '操作成功',
            });
        }catch(err){
            res.send({
                Status: 201,
                Msg: err.message,
            });
        }
    }
    delClass(Id){
        return new Promise(function (resolve,reject) {
            db.query("delete from class where Id=" + Id, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
}
module.exports = new Classify();
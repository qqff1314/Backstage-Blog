const db = require('../../models/db');

class Classify{
    constructor(){
        this.del = this.del.bind(this);
    }
    list(req, res, next){
        db.query("select * from class order by Id", function (err, data) {
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
        db.query("insert into class(ClassName,ClassArticleNum) values('" + ClassName + "','" + 0 + "')",
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
            let num = await this.checkNum(Id);
            if(Number(num[0].ClassArticleNum)!==0) {
                throw new Error('该分类无法删除')
            }
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
    checkNum(Id){
        return new Promise(function (resolve,reject) {
            db.query("select ClassArticleNum from class where Id=" + Id, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
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
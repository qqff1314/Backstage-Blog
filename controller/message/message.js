const db = require('../../models/db');
const moment = require('moment');//时间控件

class Message{
    constructor(){
        this.list = this.list.bind(this);
    }
    async list(req, res, next){
        let {Page,Limit} = req.query;
        if(!Page||!Limit){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        try{
            let num=await this.getTotal();
            let list=await this.getList(Page,Limit);
            res.send({
                Status: 200,
                data:{
                    list:list,
                    Total:num
                },
                Msg: '操作成功',
            });
        }catch(err){
            res.send({
                Status: 201,
                Msg: err.message,
            });
        }
    }
    getTotal(){
        return new Promise(function (resolve,reject) {
            db.query("select count(*) as rows from message", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data[0].rows)
                }
            })
        })
    }
    getList(Page,Limit){
        return new Promise(function (resolve,reject) {
            db.query("select * from message order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    del(req, res){
        let {Id} = req.body;
        db.query("delete from message where Id=" + Id, function (err, data) {
            if (err) {
                res.send({
                    Status: 201,
                    Msg: err
                });
            } else {
                res.send({
                    Status: 200,
                    Msg: '操作成功'
                });
            }
        })
    }
    add(req, res){
        let {Content} = req.body;
        if(!Content){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        let Time= moment().format('YYYY-MM-DD  HH:mm:ss').toString();
        db.query("insert into message(Content,Time) values('"+Content+"','"+Time+"')",function (err) {
            if (err) {
                res.send({
                    Status: 201,
                    Msg: err,
                });
            } else {
                db.query("select max(id) as Id from message",function (err,data) {
                    res.send({
                        Status: 200,
                        data:{
                            Content:Content,
                            Time:Time,
                            Id:data[0].Id
                        },
                        Msg: '操作成功',
                    });
                })
            }
        })
    }
}
module.exports = new Message();
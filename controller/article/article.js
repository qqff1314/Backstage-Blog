const db = require('../../models/db');
const moment = require('moment');//时间控件

class Article{
    constructor(){
        this.detail = this.detail.bind(this);
        this.add = this.add.bind(this);
        this.del = this.del.bind(this);
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
            db.query("select count(*) as rows from article", function (err, data) {
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
            db.query("select Id,Title,ClassName,ClassId,ReadNum,Time from article order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    async detail(req, res, next){
        let Id = req.query.Id;
        if(!Id){
            res.send({
                Status: 201,
                Msg: 'ID错误',
            });
            return;
        }
        try{
            await this.addReadNum(Id);
            let data = await this.getDetail(Id);
            res.send({
                data:data[0],
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

    addReadNum(Id){
        return new Promise(function (resolve,reject) {
            db.query("update article set ReadNum=ReadNum+1 where Id=" + Id, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    getDetail(Id){
        return new Promise(function (resolve,reject) {
            db.query("select Title,Detail,IFNULL(Url,'')as Url,ClassId,ClassName,Id from article where Id= "+ Id, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    async del(req , res , next){
        let {Id,ClassId} = req.body;
        if(!Id||!ClassId){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        try{
            await this.delArticle(Id);
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
    delArticle(Id){
        return new Promise(function (resolve,reject) {
            db.query("delete from article where Id in (" + Id + ")", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    async add(req , res , next){
        let {Title,Detail,ClassId,ClassName,Url} = req.body;
        let Time= moment().format('YYYY-MM-DD h:mm:ss').toString();
        try{
            await this.addArticle(Title,Detail,ClassId,ClassName,Url,Time);
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
    addArticle(Title,Detail,ClassId,ClassName,Url,Time){
        return new Promise(function (resolve,reject) {
            db.query("insert into article(Title,Detail,ReadNum,Time,ClassId,ClassName,Url,CollectNum) values('"
                + Title + "','" + Detail + "',"+0+",'"+Time+"','"+ClassId+"','"+ClassName+"','"+Url+"',"+0+")", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    edit(req , res , next){
        let {Title,Detail,Url,ClassId,ClassName,Id} = req.body;
        db.query("update article set Title='"
            + Title + "',Detail='" + Detail + "',Url='" + Url +"',ClassId='" + ClassId +"',ClassName='" + ClassName +"' where Id=" + Id,
            function (err, data) {
            res.send({
                Status: 200,
                Msg: '操作成功',
            });
        });
    }
}
module.exports = new Article();
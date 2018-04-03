const db = require('../../models/db');
const moment = require('moment');//时间控件

class Article{
    constructor(){
        this.detail = this.detail.bind(this);
        this.add = this.add.bind(this);
        this.del = this.del.bind(this);
    }
    list(req, res, next){
        let {Page,Limit} = req.query;
        if(!Page||!Limit){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        db.query("select Title,ClassName,ReadNum,Time from article order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
            res.send({
                Status: 200,
                data:{
                    list:data,
                },
                Msg: '操作成功',
            });
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
            db.query("select * from article where Id= "+ Id, function (err, data) {
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
            await this.changeClassNum(ClassId,'del');
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
            db.query("delete from article where Id=" + Id, function (err, data) {
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
        let Time= moment().format('YYYY-MM-DD HH:mm:ss').toString();
        try{
            await this.addArticle(Title,Detail,ClassId,ClassName,Url,Time);
            await this.changeClassNum(ClassId,'add');
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
                + Title + "','" + Detail + "','"+0+"','"+Time+"','"+ClassId+"',"+ClassName+","+Url+",'"+0+"')", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    changeClassNum(ClassId,mark){
        return new Promise(function (resolve,reject) {
            let sql;
            if(mark==='add') sql='update class set ClassArticleNum=ClassArticleNum+1 where Id=';
            if(mark==='del') sql='update class set ClassArticleNum=ClassArticleNum-1 where Id=';
            db.query(sql + ClassId, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    edit(req , res , next){
        let {Title,Detail,ClassId,ClassName,Url,Id} = req.body;
        db.query("update article set Title='"
            + Title + "',Detail='" + Detail + "',ClassName='" + ClassName + "',Url='" + Url + "',ClassId='" + ClassId +"' where Id=" + Id,
            function (err, data) {
            res.send({
                Status: 200,
                Msg: '操作成功',
            });
        });
    }
}
module.exports = new Article();
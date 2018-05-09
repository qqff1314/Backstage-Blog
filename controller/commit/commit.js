const db = require('../../models/db');
const moment = require('moment');//时间控件

class Commit{
    constructor(){
        this.addCommit = this.addCommit.bind(this);
        this.replayCommit = this.replayCommit.bind(this);
        this.list = this.list.bind(this);
        this.replayList = this.replayList.bind(this);
        this.delCommit = this.delCommit.bind(this);
        this.delReplay = this.delReplay.bind(this);
    }
    async addCommit(req , res , next){
        let CommentUserId= req.session.user_id;
        let {Comment,CommentArticleId} = req.body;
        let CommentTime=moment().format('YYYY-MM-DD HH:mm:ss').toString();
        try{
            if (!Comment||!CommentArticleId){
                throw new Error('参数错误')
            }
            let CommentUserName=await this.getName(CommentUserId);
            await this.putCommit(CommentUserId,CommentUserName,Comment,CommentArticleId,CommentTime);
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
    putCommit(CommentUserId,CommentUserName,Comment,CommentArticleId,CommentTime){
        return new Promise(function (resolve,reject) {
            db.query("insert into comment(CommentUserId,CommentUserName,Comment,CommentArticleId,CommentTime) values('" +
                CommentUserId + "','" + CommentUserName+ "','" + Comment+ "','" + CommentArticleId+ "','" + CommentTime+ "','" + CommentTime + "')",
                function (err, data) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
        })
    }
    async replayList(req, res, next){
        let {CommentId,Page,Limit} = req.query;
        if(!Page||!Limit||!CommentId){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        try{
            let num=await this.getRepalyTotal(CommentId);
            let list=await this.getRepalyList(Page,Limit,CommentId);
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
    getRepalyTotal(CommentId){
        return new Promise(function (resolve,reject) {
            db.query("select count(*) as rows from replay where CommentId=" +CommentId, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data[0].rows)
                }
            })
        })
    }
    getRepalyList(Page,Limit,CommentId){
        return new Promise(function (resolve,reject) {
            db.query("select * from replay where CommentId=" +CommentId+" order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }




    async list(req, res, next){
        let {ArticleId,Page,Limit} = req.query;
        if(!Page||!Limit||!ArticleId){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        try{
            let num=await this.getTotal(ArticleId);
            let list=await this.getList(Page,Limit,ArticleId);
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
    getTotal(ArticleId){
        return new Promise(function (resolve,reject) {
            db.query("select count(*) as rows from comment where CommentArticleId=" +ArticleId, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data[0].rows)
                }
            })
        })
    }
    getList(Page,Limit,ArticleId){
        return new Promise(function (resolve,reject) {
            db.query("select * from comment where CommentArticleId=" +ArticleId+" order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    async replayCommit(req , res , next){
        let ReplayUserId= req.session.user_id;
        let {ReplayContent,CommentId} = req.body;
        let ReplayTime=moment().format('YYYY-MM-DD HH:mm:ss').toString();
        try{
            if (!ReplayContent){
                throw new Error('参数错误')
            }
            let ReplayUserName=await this.getName(ReplayUserId);
            await this.replay(ReplayContent,ReplayTime,ReplayUserName,ReplayUserId,CommentId);
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
    getName(Id){
        return new Promise(function (resolve,reject) {
            db.query("select UserName from user where Id='"+Id+"'", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data[0].UserName)
                }
            })
        })
    }
    replay(ReplayContent,ReplayTime,ReplayUserName,ReplayUserId,CommentId){
        return new Promise(function (resolve,reject) {
            db.query("insert into replay(ReplayContent,ReplayTime,ReplayUserName,ReplayUserId,CommentId) values('" +
                ReplayContent + "','" + ReplayTime+ "','" + ReplayUserName+ "','" + ReplayUserId+ "','" + CommentId+ "')",
                function (err, data) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
        })
    }
    async delCommit(req , res , next){
        let {CommnetId} = req.body;
        if(!CommnetId){
            res.send({
                Status: 201,
                Msg: 'ID错误',
            });
            return;
        }
        try{
            await this.delR(CommnetId);
            await this.delC(CommnetId);
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
    delC(Id){
        return new Promise(function (resolve,reject) {
            db.query("delete from comment where Id=" + Id, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    delR(Id){
        return new Promise(function (resolve,reject) {
            db.query("delete from replay where CommentId=" + Id, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    async delReplay(req , res , next){
        let {ReplayId} = req.body;
        if(!ReplayId){
            res.send({
                Status: 201,
                Msg: 'ID错误',
            });
            return;
        }
        db.query("delete from replay where Id=" + ReplayId, function (err, data) {
            res.send({
                Status: 200,
                Msg: '操作成功',
            });
        })
    }
}
module.exports = new Commit();
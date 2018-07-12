const db = require('../../models/db');
const moment = require('moment');//时间控件

class Commit{
    constructor(){
        this.addCommit = this.addCommit.bind(this);
        this.adminReplay = this.adminReplay.bind(this);
        this.newComment = this.newComment.bind(this);
        this.replayCommit = this.replayCommit.bind(this);
        this.list = this.list.bind(this);
        this.replayList = this.replayList.bind(this);
        this.delCommit = this.delCommit.bind(this);
        this.delReplay = this.delReplay.bind(this);
    }
    async newComment(req, res, next){
        let {Page,Limit} = req.query;
        if(!Page||!Limit){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        try{
            let num=await this.getNewCommentTotal();
            let list=await this.getNewCommentList(Page,Limit);
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
    getNewCommentTotal(){
        return new Promise(function (resolve,reject) {
            db.query("select count(*) as rows from comment where IsRead=0", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data[0].rows)
                }
            })
        })
    }
    getNewCommentList(Page,Limit){
        return new Promise(function (resolve,reject) {
            db.query("select * from comment where IsRead=0 order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    async addCommit(req , res , next){
        let {Comment,CommentArticleId,CommentUserName} = req.body;
        let CommentTime=moment().format('YYYY-MM-DD HH:mm:ss').toString();
        try{
            if (!Comment||!CommentArticleId||!CommentUserName){
                throw new Error('参数错误')
            }
            await this.putCommit(CommentUserName,Comment,CommentArticleId,CommentTime);
            res.send({
                Status: 200,
                Msg: '操作成功',
                data:{
                    CommentUserName:CommentUserName,
                    Comment:Comment,
                    CommentTime:CommentTime
                }
            });
        }catch(err){
            res.send({
                Status: 201,
                Msg: err.message,
            });
        }
    }
    putCommit(CommentUserName,Comment,CommentArticleId,CommentTime){
        return new Promise(function (resolve,reject) {
            db.query("insert into comment(CommentUserName,Comment,CommentArticleId,CommentTime) values('" +
                CommentUserName+ "','" + Comment+ "','" + CommentArticleId+ "','" + CommentTime + "')",
                function (err, data) {
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
            let replay=await this.getReplay(ArticleId);
            let list=await this.getList(Page,Limit,ArticleId);
            list.map((item)=>{
                item.Replay=[];
                replay.map((v)=>{
                    if(item.Id===v.CommentId){
                        item.Replay.push(v)
                    }
                });
            });
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
    getReplay(ArticleId){
        return new Promise(function (resolve,reject) {
            db.query("select * from replay where CommentArticleId=" +ArticleId, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
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
        let {ReplayContent,CommentId,ReplayUserName,CommentArticleId} = req.body;
        let ReplayTime=moment().format('YYYY-MM-DD HH:mm:ss').toString();
        try{
            if (!ReplayContent){
                throw new Error('参数错误')
            }
            await this.replay(ReplayContent,ReplayTime,ReplayUserName,CommentId,CommentArticleId,0);
            await this.setRead(CommentId,0);
            res.send({
                Status: 200,
                Msg: '操作成功',
                data:{
                    ReplayContent:ReplayContent,
                    ReplayUserName:ReplayUserName,
                    ReplayTime:ReplayTime,
                }
            });
        }catch(err){
            res.send({
                Status: 201,
                Msg: err.message,
            });
        }
    }
    async adminReplay(req , res , next){
        let {ReplayContent,CommentId,ReplayUserName,CommentArticleId} = req.body;
        let ReplayTime=moment().format('YYYY-MM-DD HH:mm:ss').toString();
        try{
            if (!ReplayContent){
                throw new Error('参数错误')
            }
            await this.replay(ReplayContent,ReplayTime,ReplayUserName,CommentId,CommentArticleId,1);
            await this.setRead(CommentId,1);
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
    setRead(CommentId,val){
        return new Promise(function (resolve,reject) {
            db.query("update comment set IsRead="+val+" where Id="+CommentId,
                function (err, data) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
        })
    }
    replay(ReplayContent,ReplayTime,ReplayUserName,CommentId,CommentArticleId,IsAdmin){
        return new Promise(function (resolve,reject) {
            db.query("insert into replay(ReplayContent,ReplayTime,ReplayUserName,CommentId,CommentArticleId,IsAdmin) values('" +
                ReplayContent + "','" + ReplayTime+ "','" + ReplayUserName+ "','" + CommentId+"','" + CommentArticleId+"'," + IsAdmin+ ")",
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
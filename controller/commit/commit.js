const db = require('../../models/db');
const moment = require('moment');//时间控件

class Commit{
    constructor(){
        this.addCommit = this.addCommit.bind(this);
        this.replayCommit = this.replayCommit.bind(this)
    }
    list(req, res, next){
        let ArticleId = req.query.ArticleId;
        db.query("select * from comment order by Id where Id=" + ArticleId, function (err, data) {
            res.send({
                Status: 200,
                data:{
                    list:data,
                },
                Msg: '操作成功',
            });
        })
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
    async replayCommit(req , res , next){
        let ReplayUserId= req.session.user_id;
        let {ReplayContent,Id} = req.body;
        let ReplayTime=moment().format('YYYY-MM-DD HH:mm:ss').toString();
        try{
            if (!ReplayContent){
                throw new Error('参数错误')
            }
            let ReplayUserName=await this.getName(ReplayUserId);
            await this.updateCommit(ReplayContent,ReplayTime,ReplayUserName,Id);
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
    updateCommit(ReplayContent,ReplayTime,ReplayUserName,Id){
        return new Promise(function (resolve,reject) {
            db.query("update comment set ReplayContent='"
                + ReplayContent + "',ReplayTime='" + ReplayTime + "',ReplayUserName='" + ReplayUserName + "',IsReplay=1 where Id=" + Id,
                function (err, data) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
        })
    }
    delCommit(req , res , next){
        let {Id} = req.body;
        if(!Id){
            res.send({
                Status: 201,
                Msg: 'ID错误',
            });
            return;
        }
        db.query("delete from comment where Id=" + Id, function (err, data) {
            res.send({
                Status: 200,
                Msg: '操作成功',
            });
        })
    }
}
module.exports = new Commit();
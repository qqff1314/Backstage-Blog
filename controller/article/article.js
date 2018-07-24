const db = require('../../models/db');
const moment = require('moment');//时间控件

class Article{
    constructor(){
        this.detail = this.detail.bind(this);
        this.add = this.add.bind(this);
        this.del = this.del.bind(this);
        this.list = this.list.bind(this);
        this.listSearch = this.listSearch.bind(this);
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
            db.query("select Id,Title,ClassName,ClassId,ReadNum,Img,Time from article order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    //文章列表
    async listSearch(req, res, next){
        let {Page,Limit,KeyWord,ClassId} = req.query;
        if(!Page||!Limit){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        try{
            let num=await this.getSearchTotal(KeyWord,ClassId);
            let list=await this.getSearchList(Page,Limit,KeyWord,ClassId);
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
    getSearchTotal(KeyWord,ClassId){
        return new Promise(function (resolve,reject) {
            db.query("select count(*) as rows from article where Title like '%"+KeyWord+"%' and (ClassId='"+ClassId+"' or '"+ClassId+"'='')", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data[0].rows)
                }
            })
        })
    }
    getSearchList(Page,Limit,KeyWord,ClassId){
        return new Promise(function (resolve,reject) {
            db.query("select Id,Title,ClassName,ReadNum,Img,Time from article where Title like '%"+KeyWord+"%' and (ClassId='"+ClassId+"' or '"+ClassId+"'='') order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    //搜索文章列表
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
            db.query("select Time,ReadNum,Title,Detail,IFNULL(Url,'')as Url,ClassId,ClassName,Id from article where Id= "+ Id, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    //文章详情
    async del(req , res , next){
        let {Id} = req.body;
        if(!Id){
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
    //删除文章
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
        const reg = "<img[^<>]*?\\ssrc=['\"]?(.*?)['\"].*?>";
        let img = Detail.match(reg)||"";
        return new Promise(function (resolve,reject) {
            db.query("insert into article(Title,Detail,ReadNum,Time,ClassId,ClassName,Url,Img) values('"
                + Title + "','" + Detail + "',"+0+",'"+Time+"','"+ClassId+"','"+ClassName+"','"+Url+"','"+(img.toString().split(',')[1]||"")+"')", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    //增加文章
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
    //编辑文章
}
module.exports = new Article();
const db = require('../../models/db');
const redis = require('../../models/redis');
const moment = require('moment');//时间控件

class Article{
    constructor(){
        this.detail = this.detail.bind(this);
        this.add = this.add.bind(this);
        this.del = this.del.bind(this);
        this.listSearch = this.listSearch.bind(this);
    }
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
            let detail={}
            await redis.get('pageDetail').then((data)=>{
                if(data) {
                    data=JSON.parse(data)
                    data.map(v=>{ if(v.Id==Id) {
                        detail=v
                        detail.Redis=true
                    }})
                }
            })
            if(!detail.Id) {
                detail = await this.getDetail(Id);
                detail.Redis=false
            }
            res.send({
                data:detail,
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
    getDetail(Id){
        return new Promise(function (resolve,reject) {
            db.query("select Time,ReadNum,Title,Img,Detail,IFNULL(Url,'')as Url,ClassId,ClassName,Id from article where Id= "+ Id, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    if(data[0]){
                        redis.get('pageDetail').then((val)=>{
                            if(val) {
                                val=JSON.parse(val)
                                val.push(data[0])
                            }else{
                                val=[data[0]]
                            }
                            redis.set('pageDetail',JSON.stringify(val))
                        })
                    }
                    resolve(data[0])
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
        let {Title,Detail,ClassId,ClassName,Url,Img} = req.body;
        let Time= moment().format('YYYY-MM-DD HH:mm:ss').toString();
        try{
            await this.addArticle(Title,Detail,ClassId,ClassName,Url,Time,Img);
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
    addArticle(Title,Detail,ClassId,ClassName,Url,Time,Img){
        if(!Img){
            const reg = "<img[^<>]*?\\ssrc=['\"]?(.*?)['\"].*?>";
            let img = Detail.match(reg)||"";
            Img=img.toString().split(',')[1]||"";
        }
        let Sql = "insert into article(Title,Detail,ReadNum,Time,ClassId,ClassName,Url,Img) VALUES(?,?,?,?,?,?,?,?)";
        let Params = [Title, Detail,0,Time,ClassId,ClassName,Url,Img];
        return new Promise(function (resolve,reject) {
            db.query(Sql,Params, function (err, data) {
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
        let {Title,Detail,Url,ClassId,ClassName,Id,Img} = req.body;
        if(!Img){
            const reg = "<img[^<>]*?\\ssrc=['\"]?(.*?)['\"].*?>";
            let img = Detail.match(reg)||"";
            Img=img.toString().split(',')[1]||"";
        }
        
        db.query("update article set Title=?,Detail=?,Url=?,ClassId=?,ClassName=?,Img=? where Id=?",
            [Title,Detail,Url,ClassId,ClassName,Img,Id],
            function (err, data) {
            redis.get('pageDetail').then((data)=>{
                if(data) {
                    let map=JSON.parse(data).filter(v=>{return v.Id!=Id})
                    redis.set('pageDetail',JSON.stringify(map))
                }
            })
            res.send({
                Status: 200,
                Msg: '操作成功',
            });
        });
    }
    //编辑文章
}
module.exports = new Article();
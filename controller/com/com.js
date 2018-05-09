const db = require('../../models/db');

class Com{
    constructor(){
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
            let num=await this.getTotal(KeyWord,ClassId);
            let list=await this.getList(Page,Limit,KeyWord,ClassId);
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
    getTotal(KeyWord,ClassId){
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
    getList(Page,Limit,KeyWord,ClassId){
        return new Promise(function (resolve,reject) {
            db.query("select Title,ClassName,ReadNum,Time from article where Title like '%"+KeyWord+"%' and (ClassId='"+ClassId+"' or '"+ClassId+"'='') order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    tagSearch(req, res, next){
        let {Page,Limit,ClassId} = req.query;
        if(!Page||!Limit||!ClassId){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        db.query("select Title,ClassName,ReadNum,Time from article where ClassId =" +ClassId+" order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
            res.send({
                Status: 200,
                data:{
                    list:data,
                },
                Msg: '操作成功',
            });
        });
    }
    isLogin(req, res, next){
        const user_id = req.session.user_id;
        let data =(!user_id || !Number(user_id))?0:1;
        res.send({
            Status: 200,
            data:data,
            Msg: '操作成功',
        });
    }
}
module.exports = new Com();
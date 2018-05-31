const db = require('../../models/db');
const Crypto = require('crypto-js');

class Admin{
    constructor(){
        this.login = this.login.bind(this);
        this.userSearch = this.userSearch.bind(this);
        this.getUserList = this.getUserList.bind(this);
    }
    async login(req, res, next){
        let {UserName,UserPassWord} = req.body;
        try{
            if (!UserName) {
                throw new Error('用户名不能为空')
            }else if(!UserPassWord){
                throw new Error('密码不能为空')
            }
        }catch(err){
            res.send({
                Status: 201,
                Msg: err.message,
            });
            return
        }
        const psw=await this.base64encode(UserPassWord);
        console.log(psw)
        db.query("select IsAdmin,Id from user where UserName='"+UserName+"' and UserPassWord='"+psw+"'", function (err, data) {
            try{
                if (data.length===0) {
                    throw new Error('用户名或密码错误')
                }else if(data[0].IsAdmin === 0){
                    throw new Error('用户权限不足')
                }
            }catch(err){
                res.send({
                    Status: 201,
                    Msg: err.message,
                });
                return
            }
            req.session.user_id = data[0].Id;
            res.send({
                Status: 200,
                Msg: '登录成功',
            });
        });
    }
    logout(req, res, next){
        try{
            delete req.session.user_id;
            res.send({
                Status: 200,
                Msg: '退出成功'
            })
        }catch(err){
            res.send({
                Status: 201,
                Msg: '退出失败'
            })
        }
    }
    //base64加密
    base64encode(data){
        let words =  Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(JSON.stringify(data)));
        return words
    }
    async getUserList(req, res, next){
        let {Page,Limit} = req.query;
        if(!Page||!Limit){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        let num=await this.getTotal('');
        db.query("select Time,UserName,Id,Email,IsDisable,IsAdmin from user order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
            res.send({
                Status: 200,
                data:{
                    list:data,
                    Total:num
                },
                Msg: '操作成功',
            });
        })
    }
    async userSearch(req, res, next){
        let {Page,Limit,KeyWord} = req.query;
        if(!Page||!Limit){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        try{
            let num=await this.getTotal(KeyWord);
            let list=await this.getList(Page,Limit,KeyWord);
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
    getTotal(KeyWord){
        return new Promise(function (resolve,reject) {
            db.query("select count(*) as rows from user where UserName like '%"+KeyWord+"%'", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data[0].rows)
                }
            })
        })
    }
    getList(Page,Limit,KeyWord){
        return new Promise(function (resolve,reject) {
            db.query("select Time,UserName,Id,Email,IsDisable,IsAdmin from user where UserName like '%"+KeyWord+"%' order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    setDisable(req, res, next){
        let {Id} = req.body;
        db.query("update user set IsDisable=ABS(IsDisable-1) where Id=" + Id,
            function (err, data) {
            res.send({
                Status: 200,
                Msg: '操作成功',
            });
        })
    }
}
module.exports = new Admin();
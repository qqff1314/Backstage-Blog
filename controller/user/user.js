const db = require('../../models/db');
const Crypto = require('crypto-js');
const moment = require('moment');//时间控件


class User{
    constructor(){
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
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
        db.query("select Id from user where UserName='"+UserName+"' and UserPassWord='"+psw+"'", function (err, data) {
            try{
                if (data.length===0) {
                    throw new Error('用户名或密码错误')
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
    async register(req, res, next){
        let {UserName,UserPassWord,Email} = req.body;
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
        try{
            let isHave=await this.checkHave(UserName);
            if (isHave.length!==0){
                throw new Error('用户已存在')
            }
            await this.isReg(UserName,psw,Email);
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
    checkHave(UserName){
        return new Promise(function (resolve,reject) {
            db.query("select * from user where UserName='"+UserName+"'", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    isReg(UserName,psw,Email){
        return new Promise(function (resolve,reject) {
            let Time= moment().format('YYYY-MM-DD h:mm:ss').toString();
            db.query("insert into user(UserName,UserPassWord,Email,Time) values('" + UserName + "','" + psw + "','"+ Email +"','"+ Time +"')", function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    base64encode(data){
        let words =  Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(JSON.stringify(data)));
        return words
    }
}
module.exports = new User();
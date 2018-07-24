const db = require('../../models/db');
const Crypto = require('crypto-js');

class Admin{
    constructor(){
        this.login = this.login.bind(this);
    }
    async login(req, res){
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
        db.query("select Id from user where UserName='"+UserName+"' and UserPassWord='"+UserPassWord+"'", function (err, data) {
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
    logout(req, res){
        try{
            req.session.user_id && delete req.session.user_id;
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
        return Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(JSON.stringify(data)));
    }
    base64decode(data){
        return JSON.parse(Crypto.enc.Base64.parse(data).toString(Crypto.enc.Utf8));
    }
}
module.exports = new Admin();
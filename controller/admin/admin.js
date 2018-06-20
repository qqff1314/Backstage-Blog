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
    logout(req, res){
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
        return Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(JSON.stringify(data)));
    }
}
module.exports = new Admin();
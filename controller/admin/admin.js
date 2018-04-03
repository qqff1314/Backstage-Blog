const db = require('../../models/db');
const Crypto = require('crypto-js');

class Admin{
    async login(req, res, next){
        const user_id = req.session.user_id;
        if (user_id || Number(user_id)) {
            delete req.session.user_id;
        }
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
        db.query("select * from user where UserName='"+UserName+"'", function (err, data) {
            try{
                if (data.length===0) {
                    throw new Error('用户不存在')
                }else if(psw.toString() !== data[0].UserPassWord.toString()){
                    throw new Error('密码错误')
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
    getUserList(req, res, next){
        let {Page,Limit} = req.query;
        if(!Page||!Limit){
            res.send({
                Status: 201,
                Msg: '传参错误',
            });
            return;
        }
        db.query("select * from user where IsAdmin<>1 order by Id desc LIMIT "+(Page-1)*Limit+","+Limit, function (err, data) {
            res.send({
                Status: 200,
                data:{
                    list:data
                },
                Msg: '操作成功',
            });
        })
    }
}
module.exports = new Admin();
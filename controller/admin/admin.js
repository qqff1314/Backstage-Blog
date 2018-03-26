const db = require('../../config/db');

class Admin{
    login(req, res, next){
        let UserPhone = req.body.UserPhone;
        let UserPassword = req.body.UserPassword;
        if(!UserPhone){
            res.send({
                Status: 201,
                Msg: '手机号不能为空',
            });
            return;
        }
        if(!UserPassword){
            res.send({
                Status: 201,
                Msg: '密码不能为空',
            });
            return;
        }
        db.query("select * from user where UserPhone='"+UserPhone+"'", function (err, data) {
            if (err) {
                req.flash("err",err);
                return;
            }
            if(data.length===0){
                res.send({
                    Status: 201,
                    Msg: '用户不存在',
                });
                return;
            }
            if(data[0].UserPassword != UserPassword){
                res.send({
                    Status: 201,
                    Msg: '密码错误',
                });
                return;
            }
            if(data[0].IsAdmin === 0){
                res.send({
                    Status: 201,
                    Msg: '用户权限不足',
                });
                return;
            }
            req.session.user_id = data[0].Id;
            res.send({
                Status: 200,
                Msg: '登录成功',
            });
        });
    }
    logout(req, res, next){
        req.session.user_id = null;
        res.send({
            Status: 200,
            Msg: '退出成功',
        });
    }
}
module.exports = new Admin();
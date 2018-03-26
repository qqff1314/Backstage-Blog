const db = require('../../config/db');

class User{
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
            if(data[0].UserPassword !== UserPassword){
                res.send({
                    Status: 201,
                    Msg: '密码错误',
                });
                return;
            }
            req.session.user_id = data[0];
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
    register(req, res, next){
        let info = req.body;
        if(!info.UserName){
            res.send({
                Status: 201,
                Msg: '用户名不能为空',
            });
            return;
        }
        if(!info.UserPassWord){
            res.send({
                Status: 201,
                Msg: '密码不能为空',
            });
            return;
        }
        if(!info.UserPhone){
            res.send({
                Status: 201,
                Msg: '手机号不能为空',
            });
            return;
        }
        db.query("select * from user where UserPhone='"+info.UserPhone+"'", function (err, data) {
            if (err) {
                req.flash("err",err);
                return;
            }
            if(data.length==0){
                db.query("insert into user(UserName,UserPassWord,UserPhone) values('" + info.UserName + "','" + info.UserPassWord + "','" + info.UserPhone +"')", function (err, rows) {
                    if (err) {
                        req.flash("err",err);
                        return;
                    } else {
                        res.send({
                            Status: 200,
                            Msg: '注册成功',
                        });
                    }
                })
            }else{
                res.send({
                    Status: 201,
                    Msg: '用户已存在',
                });
            }
        });
    }
}
module.exports = new User();
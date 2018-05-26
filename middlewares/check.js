const db = require('../models/db');
const moment = require('moment');//时间控件

//200正常 201报错 202登录失效 203已禁言 204无权限


class Check {
	checkLogin(req, res, next){
		const user_id = req.session.user_id;
		if (!user_id || !Number(user_id)) {
			res.send({
				Status: 202,
                Msg: '登录失效',
			});
			return
		}
		next()
	}//是否登录了
    checkDisable(req, res, next){
        const user_id = req.session.user_id;
        db.query("select * from user where Id=" + user_id, function (err, data) {
        	if(data.IsDisable===1){
                res.send({
                    Status: 203,
                    Msg: '该用户已经禁言',
                });
                return;
			}
            next()
        });

    }//是否被禁言
    checkAdmin(req, res, next){
        const user_id = req.session.user_id;
        if (!user_id || !Number(user_id)) {
            res.send({
                Status: 202,
                Msg: '登录失效',
            });
            return
        }
        db.query("select * from user where Id=" + user_id, function (err, data) {
            if(data.IsAdmin===0){
                res.send({
                    Status: 204,
                    Msg: '用户暂无权限',
                });
                return;
            }
            next()
        });
    }//是否是管理员
    async uv(req, res, next){
         let Date;
         await db.query("select Time from read  ORDER BY Id DESC LIMIT 1", function (err, data) {
            res.send({
                Status: 204,
                Msg: data,
            });
         });
        // if(req.session.time){
        //     let start=Date.parse(req.session.time);
        //     let now=Date.parse(moment().format('YYYY-MM-DD').toString());
        //     let end=start+86400000;
        //     if(start<now<end){
        //
        //     }else{
        //         db.query("update read Uv=Uv+1 where ", function (err, data) {})
        //
        //     }
        //
        // }else{
        //     // let time=moment().format('YYYY-MM-DD').toString();
        //
        //     // req.session.time=time;
        //     // db.query("insert into article(Time,Uv) values('"+ time + "','" + 1 +")", function (err, data) {})
        // }
        next()
    }
}

module.exports = new Check();
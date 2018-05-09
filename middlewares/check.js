const db = require('../models/db');
//200正常 201报错 202登录失效 203已禁言 204无权限


class Check {
	checkLogin(req, res, next){
		// const user_id = req.session.user_id;
		// if (!user_id || !Number(user_id)) {
		// 	res.send({
		// 		Status: 202,
         //        Msg: '登录失效',
		// 	});
		// 	return
		// }
		next()
	}
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

    }
    checkAdmin(req, res, next){
        // const user_id = req.session.user_id;
        // if (!user_id || !Number(user_id)) {
        //     res.send({
        //         Status: 202,
        //         Msg: '登录失效',
        //     });
        //     return
        // }
        // db.query("select * from user where Id=" + user_id, function (err, data) {
        //     if(data.IsAdmin===0){
        //         res.send({
        //             Status: 204,
        //             Msg: '用户暂无权限',
        //         });
        //         return;
        //     }
            next()
        // });
    }
}

module.exports = new Check();
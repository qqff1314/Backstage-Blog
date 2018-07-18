//200正常 201报错 202登录失效
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
}

module.exports = new Check();
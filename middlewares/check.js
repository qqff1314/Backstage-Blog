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
	}
}

module.exports = new Check();
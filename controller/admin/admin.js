class Admin{
    async login(req, res, next){
        res.send({
            status: 0,
            type: 'FORM_DATA_ERROR',
            message: '表单信息错误'
        })
    }
}
module.exports = new Admin();
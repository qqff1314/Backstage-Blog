const db = require('../../config/db');

class Article{
    list(req, res, next){
        let page = req.query.Page||1;
        let limit = req.query.Limit||10;
        let info = {Page:page,Total:0};
        db.query('select count(*) as rows from article', function (err, data) {
            if(data[0].rows!==0){
                info.Total = Math.ceil(data[0].rows/limit);
                db.query("select * from article order by id desc LIMIT "+(page-1)*limit+","+limit, function (err, data) {
                    res.send({
                        Status: 200,
                        data:{
                            list:data,
                            Page:info.Page,
                            Total:info.Total
                        },
                        Msg: '操作成功',
                    });
                })
            }else{
                res.send({
                    Status: 200,
                    data:{
                        list:[],
                        Page:info.Page,
                        Total:0
                    },
                    Msg: '操作成功',
                });
            }
        })
    }
}
module.exports = new Article();
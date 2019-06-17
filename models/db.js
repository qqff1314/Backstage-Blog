const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit : 100, //important
    host: 'localhost',
    user: 'root',
    password: '892433342ZXC@qq',
    database: 'myBlog',
    // port:3506
});
function query(sql,params, callback) { 
    if(typeof params === "function"){
        callback=params;
        params=[]
    }
    pool.getConnection(function (err, connection) {
        if(err){
            callback(err,null);
        }else{
            connection.query(sql,params,function (err, rows) {
                callback(err, rows);
                connection.release();//释放链接
            });
        }
    });
}
exports.query = query;
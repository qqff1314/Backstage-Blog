var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'myBlog'
});
function query(sql, callback) {
    pool.getConnection(function (err, connection) {
        if(err){
            callback(err,null);
        }else{
            connection.query(sql, function (err, rows) {
                callback(err, rows);
                connection.release();//释放链接
            });
        }
    });
}
exports.query = query;
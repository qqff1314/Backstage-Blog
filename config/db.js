var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'myBlog'
});

function query(sql, callback) {
    pool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(sql, function (err, rows) {

            console.log(err)
            callback(err, rows);
            connection.release();//释放链接
        });
    });
}
exports.query = query;
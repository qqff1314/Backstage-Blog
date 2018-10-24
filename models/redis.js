var redis = {};
var r = require("redis");
var client = r.createClient({
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});
 
client.on("error", function (err) {
  console.log("Error :" , err);
});
 
client.on('connect', function(){
  console.log('Redis连接成功.');
})
 
/**
 * 添加
 */
redis.set = function(key, value, expire){
    return new Promise((resolve, reject) =>{
        client.set(key, value, function(err, result){
            if (err) {
                reject();
            }
            if ( expire && expire > 0 ) {
                client.expire(key, Number(expire));
            }
            resolve(result)
        })
    })
}
 
/**
 * 查询
 */
redis.get = function(key){
    return new Promise((resolve, reject) =>{
        client.get(key, function(err,res){
            if(err){
                reject(err)
            }
            resolve(res)
        })
    })
}

/**
 * 删除
 */
redis.del = function(key){
    return new Promise((resolve, reject) =>{
        client.del(key, function(err,res){
            if(err){
                reject(err)
            }
            resolve(res)
        })
    })
}
module.exports = redis;
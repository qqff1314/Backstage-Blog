class Com{
    constructor(){
    }
    upload(req, res){
        res.send({
            Status: 200,
            data:{
                Url:'http://'+req.host+':3001/upload/'+req.file.filename,
            },
            Msg: '操作成功',
        });
    }
}
module.exports = new Com();
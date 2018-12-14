const db = require('../../models/db');
const fs = require('fs');
const qn = require('qn');
const client = qn.create({
    accessKey: 'wc2nF8r4lYiDIdhcfpZv33FE-5U9UyDgWDOV3HPI',
    secretKey: 'lLmILE5jl8XTcxsKAQMl0lDpvX8AKnTLOgTMXxjo',
    bucket: 'blog',
    origin: 'http://resource.mxxxy.cn'
})
class Com{
    constructor(){
    }
    upload(req, res){
        let filePath='./public/upload/'+req.file.filename
        client.uploadFile(filePath, {key: `/${req.file.filename}`}, function (err1, result) {
            if (err1) {
                res.json({
                    Status: 201,
                    Msg: '上传失败'
                });
            } else {
                res.json({
                    Status: 200,
                    result: {
                        path: result.url
                    },
                    Msg: '操作成功',
                })
            }
            // 上传之后删除本地文件
            fs.unlinkSync(filePath);
        });
    }
}
module.exports = new Com();
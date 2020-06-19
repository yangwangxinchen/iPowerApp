var express = require('express');
var router = express.Router();
var path = require('path');
var http = require('http');

router.post('/readPdfFile', function (req, res, next) {
    var f = req.body.pdf_url//文件地址
    var req = http.get(f, function (response) {
        var imgData = "";
        response.setEncoding("binary");//一定要设置response的编码为binary否则会下载下来的图片打不开
        console.log("正在下载中...");
        response.on("data", function
            (chunk) {
            imgData += chunk;
        });
        response.on("end", function () {
            console.log(response.headers)
            console.log(response.headers['content-disposition']);
            var filename = response.headers['content-disposition'].substring(response.headers['content-disposition'].indexOf("=")+1,response.headers['content-disposition'].length);
            console.log(filename);
            var __data = new Buffer(imgData, 'binary').toString('base64');
            res.write(__data);
            res.end();
        });

        response.on("error", function
            (err) {console.log("请求失败");
        });

    });
});


module.exports = router;
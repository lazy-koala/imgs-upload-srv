/**
 * @Author:acexy@thankjava.com
 * 2018/6/14
 * @Description:通过busboy解析post数据完成上传动作
 */
const Busboy = require('busboy');

const fs = require('fs');
const uploadConfig = require('../config/upload');
const util = require('../lib/util');
const path = require('path');
const allowedMimeType = require('../const/allowedMimeType');

module.exports.upload = (ctx) => new Promise(resolve => {
    let uploadResult = [];
    let nodeHttpReq = ctx.req;
    let busboy = new Busboy({headers: nodeHttpReq.headers});

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) { // 每次接收文件就触发

        if (allowedMimeType.indexOf(mimetype) != -1) {

            console.log('=> busboyUpload'.cyan + ' begin to upload filename = '.grey + filename.blue);

            let result = {
                fileName: filename,
                uploadTime: Date.now(),
            };

            let basePath = uploadConfig.path;
            let date = new Date();
            let dirPath = path.join(String(date.getFullYear()), String(date.getMonth() + 1), String(date.getDate()));
            let filePath = path.join(basePath, dirPath);
            mkdirsSync(filePath);
            let fileName = util.md5(util.uuid() + Date.now()) + '.' + filenameSuffix(filename);
            let uriPath = path.join(dirPath, fileName);
            let absPath = path.join(filePath, fileName);


            // -------------------------------------------------
            // 由于前端使用blob方式不再使用当前模式
            // file.pipe(fs.createWriteStream(absPath));

            let bfs = [];
            file.on('data', (chunk) => {
                bfs.push(chunk);
            });
            // -------------------------------------------------

            file.on('end', () => {

                let buf = Buffer.concat(bfs);
                let imgBase64 = buf.toString();
                fs.writeFileSync(absPath, Buffer.from(imgBase64, 'base64'));

                if (uploadConfig.maxFileSize) {
                    if (fs.statSync(absPath).size > uploadConfig.maxFileSize) {

                        util.fsDel(absPath);

                        result.flag = false;
                        result.message = '图片超过最大限制';
                        uploadResult.push(result);

                        return;
                    }
                }

                result.path = path.sep + uriPath;
                result.flag = true;
                result.absPath = absPath;
                result.message = '上传完成';
                console.log('=> busboyUpload'.cyan + ' finished to upload filename = '.grey + filename.blue + ' path = '.grey + absPath.blue);

                uploadResult.push(result);
            });
        } else {
            console.log('=> busboyUpload'.cyan + ' not allowed mimetype filename = '.grey + filename.blue + ' mimetype = '.grey + mimetype.blue);
            file.resume(); // 丢弃数据, 在监听了file事件后必须要处理file流,否则busboy不会触发finish事件
            uploadResult.push({
                flag: false,
                fileName: filename,
                message: '不允许的的文件上传格式'
            });
        }

    });

    let fields = {};

    busboy.on('field', function (fieldname, val, fieldNameTruncated, valTruncated, encoding, mimetype) {
        if (fields[fieldname]) {
            if (Array.isArray(fields[fieldname])) {
                let array = fields[fieldname];
                array.push(val);
                fields[fieldname] = array;
            } else {
                fields[fieldname] = [fields[fieldname], val];
            }
        } else {
            fields[fieldname] = val;
        }
    });

    busboy.on('finish', function () {
        resolve({
            flag: true,
            uploadResult: uploadResult,
            fields: fields
        });

    });

    busboy.on('error', function (err) {
        console.log(err);
        resolve({
            flag: false,
        });
    });

    nodeHttpReq.pipe(busboy);
});

/**
 * 解析文件名后缀
 * @param filename
 * @returns {*|string}
 */
const filenameSuffix = filename => {
    let array = filename.split('.');
    return array[array.length - 1];
};

const mkdirsSync = dirname => {
    if (fs.existsSync(dirname)) {
        return true
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true
        }
    }
};
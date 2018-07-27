/**
 * @Author: acexy@thankjava.com
 * 2018/7/16
 * @Description:
 */
const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail');
const mailType = require('../const/mailType');
const fs = require('fs');
const path = require('path');

let transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: mailConfig.auth
});

/**
 *
 * @param mailType
 * @param toMail
 * @param content  { title:"", mailType:"", params:{} }
 * @returns {Promise<any>}
 */
module.exports.send = (type, toMail, params) => new Promise(resolve => {

    let config = mailType.config[type];

    let mailOptions = {
        from: mailConfig.auth.user,
        to: toMail,
        subject: config.title,
        html: buildContent(config, params),
    };

    transporter.sendMail(mailOptions, (error, info) => {

        if (error) {
            console.log('=> nodeemailer: '.magenta + ' send failed toMail = '.red + toMail.blue);
            console.log(error);
            resolve(false);
            return;
        }
        console.log('=> nodeemailer: '.magenta + ' send success info = '.grey + JSON.stringify(info).blue);

        resolve(true);
    });
});

const templates = new Map();

const buildContent = (config, params) => {
    let template = templates.get(config.templateName);
    if (!template) {
        path.join(__dirname, '..', 'config', 'mailTemplate', config.templateName);
        template = fs.readFileSync(path.join(__dirname, '..', 'config', 'mailTemplate', config.templateName)).toString();
        templates.set(config.templateName, template);
    }
    if (params) {
        for (var index = 0; index < params.length; index++) {
            template = template.replace('{' + index + '}', params[index]);
        }
    }
    return template;
};

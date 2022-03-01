/**
 * @Author: acexy@thankjava.com
 * 2018/6/15
 * @Description: mongoose
 */
const mongoose = require('mongoose');

const mongoConfig = require('../config/mongo');

module.exports.open = (cb) => {

    const connStr = 'mongodb://' + mongoConfig.username + ':' + mongoConfig.password + '@' + mongoConfig.host + ':' + mongoConfig.port + '/' + mongoConfig.dbname;
    mongoose.connect(connStr);

    let db = mongoose.connection;

    db.on('error', function (err) {
        console.error('=> mongoose: '.green + ' error'.red);
        console.error(err);
    });

    db.once('open', function () {
        console.log('=> mongoose: '.green + 'connected'.grey);
        cb();
    });
};

const models = new Map();

module.exports.loadModel = (modelName, schema) => {
    let model = models.get(modelName);
    if (model) return model;
    console.log('=> mongoose: '.green + 'loadModel modelName = '.grey + modelName.blue);
    model = mongoose.model(modelName, schema, modelName);
    models.set(modelName, model);
    return model;
};
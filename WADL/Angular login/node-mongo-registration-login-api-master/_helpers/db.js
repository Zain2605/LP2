const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false" || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model')
};
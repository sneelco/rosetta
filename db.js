/*global require */

var mongoose = require('mongoose'),
  config = require('./config'),
  path = require('path'),
  url = 'mongodb://' + path.join(config.mongo_server, config.mongo_collection);

mongoose.connect(url);
module.exports = mongoose;
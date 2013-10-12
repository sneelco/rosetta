/*global require, console */
var config = require('./config'),
  Test = require('./app'),
  app = new Test();

console.log('Starting up', config.app_name);
app.on('ready', function () {
  'use strict';

  app.app.listen(config.http_port);
  console.log('Listening on port ' + config.http_port);
});

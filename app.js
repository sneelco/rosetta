/*global require */

var events = require('events'),
    util = require('util'),
    App;

module.exports = App = function () {
  'use strict';

  var db = require('./db').connection,
      express = require('express'),
      self = this,
      app = express();

  db.on('error', console.log.bind(console, 'connection error'));
  db.once('open', function () {
    console.log('Connection to MongoDB is ready');
    self.emit('ready');
  });

  app.set('views', 'views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('oijas89ud8yh3u'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static('static'));

  require('./controllers')(app);
  require('./routes')(app);

  self.app = app;
};

util.inherits(App, events.EventEmitter);
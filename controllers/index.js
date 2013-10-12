/*global module, require*/

module.exports = function (app) {
  'use strict';

  app.controllers = {};
  app.controllers.rest = require('./rest');
};
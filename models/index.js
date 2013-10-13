/*global module */

var mongoose = require('mongoose'),
    models = {},
    helloSchema;

helloSchema = mongoose.Schema({
  name: {type: String, required: true}
});

helloSchema.pre('save', function (next) {
  'use strict';

  var e,
      self = this;

  models.hello.findOne({_id: {$ne: self._id}, name: self.name}, function (err, record) {
    if (record) {
      self.invalidate('name', 'Name must be unique');
    }

    if (self.errors) {
      e = new Error();
      e.errors = self.errors;
      next(e);
    } else {
      next();
    }
  });
});

zoneSchema = mongoose.Schema({
  name: {type: String, required: true},
  views: [{
    _id: {type: String, required: true},
    ttl: {type: String, required: true},
    mname: {type: String, required: true},
    rname: {type: String, required: true},
    serial: {type: String, required: true},
    refresh: {type: String, required: true},
    retry: {type: String, required: true},
    expire: {type: String, required: true},
    minimum: {type: String, required: true},
  }],
});

models.zones = mongoose.model('zones', zoneSchema);
models.hello = mongoose.model('Hello', helloSchema);

module.exports = models;
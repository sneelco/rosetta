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

models.hello = mongoose.model('Hello', helloSchema);

module.exports = models;
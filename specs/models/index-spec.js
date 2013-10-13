/*global require, describe, it, expect*/
var Models = require('../../models'),
    mongoose = require('mongoose'),
    Rest = require('../../controllers/rest');

describe('Models module', function () {
  'use strict';
  it('should return an Object', function () {
    expect(Models instanceof Object).toBeTruthy();
  });
  it('should return an array of mongoose models', function () {
    var name,
        model,
        verify,
        results = true;

    for (name in Models) {
      if (Models.hasOwnProperty(name)) {
        model = Models[name];
        verify = (model !== undefined && model.prototype && model.prototype instanceof mongoose.Model);
        if (!verify) {
          break;
        }
      }
    }
    expect(results).toBeTruthy();
  });
});
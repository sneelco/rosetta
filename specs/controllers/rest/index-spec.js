/*global require, describe, it, expect*/
var Models = require('../../../models'),
    Rest = require('../../../controllers/rest');

describe('Rest.parseSort function', function () {
  'use strict';
  it('should return undefined if no sort passed', function () {
    var sort = Rest.parseSort(undefined, Models.hello);
    expect(sort).toEqual(undefined);
  });

  it('should return an Object with a valid field and model', function () {
    var sort = Rest.parseSort('name', Models.hello);
    expect(sort).toEqual({name: 1});
  });

  it('should return an object with descending order if a field is prepended with a -', function () {
    var sort = Rest.parseSort('-name', Models.hello);
    expect(sort).toEqual({name: -1});
  });

  it('should throw an error if passed an invalid field', function () {
    var test = function () {
      Rest.parseSort('names', Models.hello);
    };
    expect(test).toThrow();
  });

  it('should throw an error if passed an invalid model', function () {
    var test = function () {
      Rest.parseSort('name', Models.hellos);
    };
    expect(test).toThrow();
  });
});

describe('Rest.parseRange function', function () {
  it('should return an Object with no limit or skip if not passed anything', function () {
    var options = Rest.parseRange();
    expect(options).toEqual({limit: null, skip: 0});
  });
});

describe('Rest.parseFilter function', function () {
});

describe('Rest.get_model function', function () {
});

describe('Rest.get_record function', function () {
});

describe('Rest.add_record function', function () {
});

describe('Rest.update_record function', function () {
});

describe('Rest.delete_record function', function () {
});

describe('Rest.requireJson function', function () {
});
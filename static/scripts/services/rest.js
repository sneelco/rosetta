/*global define, angular */
define(['angular', 'angular-resource'], function () {
  'use strict';

  return angular.module('Rest', ['ngResource']).factory('RestModel',
    function ($resource) {
      return $resource(
        '/rest/:version/:model/:_id',
        {
          version: '@version',
          model: '@model',
          _id: '@_id'
        },
        {
          create: {method: 'POST'},
          update: {method: 'PUT'}
        }
      );
    });
});
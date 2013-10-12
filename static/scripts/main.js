/*global require, angular */

require.config({
  baseUrl: 'scripts',
  paths: {
    'angular': '../vendor/angular/angular',
    'angular-route': '../vendor/angular-route/angular-route',
    'angular-resource': '../vendor/angular-resource/angular-resource',
    'jquery': '../vendor/jquery/jquery',
    'jquery-ui': '../vendor/jquery-ui/jquery'
  },
  shim: {
    'angular-route': {
      deps: ['angular']
    },
    'angular-resource': {
      deps: ['angular']
    },
    'jquery-ui': {
      deps: ['jquery']
    }
  }
});

require(
  [
    'angular',
    'routes',
    'controllers',
    'filters',
    'services'
  ],
  function () {
    'use strict';

    angular.bootstrap(document, ['Rosetta']);
  }
);
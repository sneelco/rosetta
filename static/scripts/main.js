/*global require, angular */

require.config({
  baseUrl: 'scripts',
  paths: {
    'angular': '../vendor/angular/angular',
    'angular-ui-router': '../vendor/angular-ui-router/release/angular-ui-router',
    'angular-grid': '../vendor/angular-grid/ng-grid-2.0.7.min',
    'angular-grid-flexheight': '../vendor/angular-grid/plugins/ng-grid-flexible-height',
    'angular-route': '../vendor/angular-route/angular-route',
    'angular-resource': '../vendor/angular-resource/angular-resource',
    'jquery': '../vendor/jquery/jquery',
    'jquery-ui': '../vendor/jquery-ui/ui/jquery-ui'
  },
  shim: {
    'angular-route': {
      deps: ['angular']
    },
    'angular-grid': {
      deps: ['angular', 'jquery', 'jquery-ui', 'angular-grid-flexheight']
    },
    'angular-ui-router': {
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
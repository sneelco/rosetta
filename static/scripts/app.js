/*global define, angular */
define(['angular', 'angular-route', 'angular-ui-router','angular-grid'], function () {
  'use strict';

  return angular.module('Rosetta', ['Rest', 'ngRoute', 'ui.router', 'ngGrid']);
});
/*global define */
define(['app'], function (app) {
  'use strict';

  app.config(function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home.html'
    });
  });
});
/*global define */
define(['app'], function (app) {
  'use strict';

  app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/Overview');
    $urlRouterProvider.when('/Zones', '/Zones/List');

    $stateProvider
      .state('Overview', {
        url: '/Overview',
        templateUrl: 'views/overview/index.html'
      })
      .state('Zones', {
        url: '/Zones',
        templateUrl: 'views/zones/index.html',
        go: 'Zones.List'
      })
      .state('Zones.List', {
        url: '/List',
        controller: 'ZonesCtl',
        templateUrl: 'views/zones/list.html'
      })
      .state('Zones.Create', {
        url: '/Create',
        templateUrl: 'views/zones/create.html'
      });
  });
});
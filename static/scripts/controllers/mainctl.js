/*global define, prompt */
define(['app'], function (app) {
  'use strict';

  app.controller('MainCtl', ['$scope', '$location', function ($scope, $location) {
    $scope.path = undefined;
    $scope.location = $location;

    $scope.$on('$locationChangeSuccess', function () {
      var i,
          url,
          part,
          total,
          prev = '',
          trail = [];


      $scope.currentLocation = $location.$$path;
      console.log('here: %s', $scope.currentLocation)
      $scope.path = $location.$$path.split('/');
      total = $scope.path.length;

      for (i = 0; i < total; i += 1) {
        part = $scope.path[i];
        url = (prev !== '') ? prev + '/' + part : part;
        trail.push({'name': part, 'path': url});
        prev = url;
      }

      trail[0].path = '/Overview';
      trail[0].name = '⌂';

      $scope.path = trail;
    });

  }]);
});
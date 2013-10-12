/*global define, prompt */
define(['app'], function (app) {
  'use strict';

  app.controller('MainCtl', ['$scope', '$location', 'RestModel', function ($scope, $location, RestModel) {
    var RestInterface;

    $scope.location = $location;
    $scope.greeting = 'Hello World from an AngularJS Controller';

    RestInterface = RestModel.bind({version: 'v1', model: 'hello'});

    $scope.records = RestInterface.query();
    $scope.newRecord = new RestInterface();


    $scope.deleteGreeting = function (record) {
      record.$delete(
        function () {
          $scope.info = 'Greeting Deleted';
          $scope.error = '';
        }
      );
      $scope.records = RestInterface.query();
    };

    $scope.updateGreeting = function (record) {
      var newName;

      newName = prompt('Enter a new name', record.name);
      if (newName) {
        record.name = newName;
        record.$update(
          function () {
            $scope.info = 'Greeting Saved';
            $scope.error = '';
          },
          function (msg) {
            $scope.info = '';
            $scope.error = msg;
          }
        );
      }
    };

    $scope.addGreeting = function () {
      $scope.newRecord.$create(
        function () {
          $scope.info = 'Greeting Added';
          $scope.error = '';
          $scope.records = RestInterface.query();
          $scope.newRecord = new RestInterface();
        },
        function (msg) {
          $scope.info = '';
          $scope.error = msg;
        }
      );
    };
  }]);
});
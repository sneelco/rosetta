/*global define, prompt */
/*jshint -W055 */
define(['app'], function (app) {
  'use strict';

  app.controller('ZonesCtl', ['$scope', function ($scope) {

    $scope.myData = [{name: 'Moroni', age: 50},
                     {name: 'Teancum', age: 43},
                     {name: 'Jacob', age: 27},
                     {name: 'Nephi', age: 29},
                     {name: 'Enos', age: 34}];

    $scope.zonesGrid = {
      data: 'myData',
      plugins: [new ngGridFlexibleHeightPlugin()]
    };

  }]);
});
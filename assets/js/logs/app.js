'use strict';

// /**
// * logsApp Module
// *
// * Description
// */
var app = angular.module('pebbleLogsApp', ['ngResource']);

app.controller('MainCtrl', ['$scope', 'LogsResource', function MainCtrl($scope, LogsResource) {

  $scope.logs = [];

  function logsResourceLoad(logs) {
    $scope.logs = logs;
  }

  function logsResourceError() {
    
  }

  LogsResource
    .query()
      .$promise
        .then(logsResourceLoad)
        .catch(logsResourceError);

  
}]);

app.provider('LogsResource', function LogsResource() {
    this.$get = ['$resource', function($resource) {
      var LogsResource = $resource(
        '/logs/api',
        {}
      );

      return LogsResource;
    }];
  }
);



// Currency with no decimal points
app.filter('toPrecision', function filterToPrecision() {
  return function(number, precision) {

    // Default precision is 6
    precision = precision ? parseInt(precision, 10) : 6;

    // Returns converted
    return parseFloat(number).toPrecision(precision);
  };
});

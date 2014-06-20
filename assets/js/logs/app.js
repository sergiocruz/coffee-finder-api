'use strict';

// /**
// * logsApp Module
// *
// * Description
// */
var app = angular.module('pebbleLogsApp', ['ngResource', 'ngReactGrid']);

app.controller('MainCtrl', [
  '$scope',
  '$filter',
  'LogsResource',
  'ngReactGrid',
  function MainCtrl($scope, $filter, LogsResource, ngReactGrid) {

    $scope.logs = [];

    function fetchLogsOnLoad(logs) {
      $scope.logs = logs;

      var formattedLogs = [];
      angular.forEach(logs, function(log) {

        // Model
        var model = {};
        model.date = $filter('date')(log.createdAt, 'medium');
        model.lat  = $filter('toPrecision')(log.request.lat, 8);
        model.lon  = $filter('toPrecision')(log.request.lon, 8);
        model.size = (log.response.data[0].name.length + log.response.data[0].address.length + log.response.data[0].city.length + 2) + ' bytes';
        model.name = log.response.data[0].name;
        model.addr = log.response.data[0].address;

        // Model
        formattedLogs.push(model);
      });

      // Sets list of models to grid
      $scope.grid.data = formattedLogs;

    }

    function fetchLogsError() {}

    function fetchLogs() {
      LogsResource
        .query()
          .$promise
            .then(fetchLogsOnLoad)
            .catch(fetchLogsError);
    }

    $scope.grid = {
      data: [],
      columnDefs: [
        {
          field: 'date',
          displayName: 'Date'
        },
        {
          field: 'lat',
          displayName: 'Lat'
        },
        {
          field: 'lon',
          displayName: 'Lon'
        },
        {
          field: 'size',
          displayName: 'Size'
        },
        {
          field: 'name',
          displayName: 'Name'
        },
        {
          field: 'addr',
          displayName: 'Address'
        }
      ],
      localMode: false,
      getData: function() {
        fetchLogs();
      }
    };

  }
]);


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

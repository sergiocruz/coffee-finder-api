'use strict';

// /**
// * logsApp Module
// *
// * Description
// */
var app = angular.module('pebbleLogsApp', ['ngResource', 'ngReactGrid']);

app.controller('LogsCtrl', [
  '$scope',
  '$filter',
  'LogsResource',
  function LogsCtrl($scope, $filter, LogsResource) {

    $scope.logs = [];

    function fetchLogsOnLoad(logs) {

      console.log(logs);

      $scope.logs = logs.data;

      var formattedLogs = [];
      angular.forEach(logs.data, function(log) {

        console.log('log: ', log);

        // Model
        var model = {};
        model.createdAt = $filter('date')(log.createdAt, 'medium');
        model.lat  = $filter('toPrecision')(log.request.lat, 5);
        model.lon  = $filter('toPrecision')(log.request.lon, 5);

        if (log.response.data.length > 0) {
          model.name = log.response.data[0].name;
          model.addr = log.response.data[0].address;
          model.city = log.response.data[0].city + ', ' + log.response.data[0].state;
        }

        // Model
        formattedLogs.push(model);
      });

      // Sets list of models to grid
      $scope.grid.data = formattedLogs;
      $scope.grid.totalCount = logs.totalCount;

    }

    function fetchLogsError() {}

    function fetchLogs(params) {
      LogsResource
        .query(params)
          .$promise
            .then(fetchLogsOnLoad)
            .catch(fetchLogsError);
    }

    $scope.grid = {
      data: [],
      height: 1000,
      columnDefs: [
        {
          field: 'createdAt',
          displayName: 'Date'
        },
        {
          field: 'lat',
          displayName: 'Lat',
          sort: false
        },
        {
          field: 'lon',
          displayName: 'Lon',
          sort: false
        },
        {
          field: 'name',
          displayName: 'Name',
          sort: false
        },
        {
          field: 'addr',
          displayName: 'Address',
          sort: false
        },
        {
          field: 'city',
          displayName: 'City',
          sort: false
        },
      ],
      localMode: false,
      getData: function() {
        
        var grid = this;

        console.log(grid);

        var params = {
          limit: grid.pageSize,
          sortDir: grid.sortInfo.dir,
          sortField: grid.sortInfo.field,
          page: grid.currentPage || 1
        };

        fetchLogs(params);
      }
    };

  }
]);


app.provider('LogsResource', function LogsResource() {
    this.$get = ['$resource', function($resource) {
      var LogsResource = $resource(
        '/logs/api',
        {},

        {
          query: {
            isArray: false
          }
        }
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

'use strict';

var FoursquareService = (function() {

  // Dependencies
  var request = require('request');
  var qs = require('qs');
  var Q = require('q');

  // Module to be exported
  var module = {};

  /**
   * Response transformer, this private function leverages our response model
   * as an effort to consolidate all our responses regardless of API vendors.
   * 
   * @param  {Object} fsResponse  Response object returned by foursquare
   * @return {Array}              Array of V1Response.businessModels()
   */
  function transformResponse(fsResponse) {

    var data = [],
        i = 0,
        responseObject,
        fsBusiness,
        BusinessModel,
        model;

    // BusinessModel class
    BusinessModel = V1Response.getBusinessModel();

    // Response object
    responseObject = V1Response.getResponse();
    responseObject.source = 'foursquare';

    for (i in fsResponse.venues) {

      // Foursquare business object
      fsBusiness = fsResponse.venues[i];


      // New BusinessModel instance
      model = new BusinessModel();
      model.name    = fsBusiness.name;
      model.address = fsBusiness.location.address;
      model.city    = fsBusiness.location.city;
      model.state   = fsBusiness.location.state;
      model.phone   = fsBusiness.contact.phone;
      model.zip     = fsBusiness.location.postalCode;

      // Adds model to response data
      data.push(model);
    }

    // Sets data
    responseObject.data = data;

    // Returns response object
    return responseObject;
  }

  /**
   * Searches venue by geographical location
   * 
   * @param  {String} term Search term
   * @param  {Decimal} lat  Latitude
   * @param  {Decimal} lon  Longitude
   * @return {Object}       Promise object
   */
  module.search = function foursquareSearch(term, lat, lon, radius, limit) {

    // Declarations
    var endpoint = 'https://api.foursquare.com/v2/venues/search?',
        deferred,
        ll,
        params,
        url;

    // Using Q to promisify this method
    deferred = Q.defer();

    // Formatting lat and long
    ll  = lat + ',' + lon;

    // Params to be sent over to foursquare
    params = {
      'client_id': '3V4PSAGGYTIUONDZQNWI3HM1X1IADNRN2KVU0RMTRWIVULQM',
      'client_secret': 'LVGKNQD5GDQ4RGRXPKUWZ0FHD0VQSPDLBXTTDNLCUR3ZEKN3',
      'v': new Date().getTime(),
      'limit': limit,
      'll': ll,
      'query': 'coffee shop',
      'intent': 'checkin',
      'radius': radius * 1000
    };

    url = endpoint + qs.stringify(params);

    // Executes request
    request({url: url, json: true}, function foursquareRequest(error, response, body) {

      if (!error && response.statusCode === 200) {
        return deferred.resolve(transformResponse(body.response));
      }

      return deferred.reject(body);
    });

    // Return Q promise
    return deferred.promise;

  };

  return module;
  
})();

module.exports = FoursquareService;

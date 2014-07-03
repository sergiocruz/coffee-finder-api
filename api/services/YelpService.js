'use strict';
/* jshint camelcase: false */

/**
 * Yelp service module
 * @type {Object}
 */
var YelpService = (function() {

  // Module Dependencies
  var Q = require('q');

  /**
   * Response transformer, this private function leverages our response model
   * as an effort to consolidate all our responses regardless of API vendors.
   * 
   * @param  {Object} yelpResponse  Response object returned by yelp
   * @return {Array}                Array of V1Response.businessModels()
   */
  function transformResponse(yelpResponse) {

    var data = [],
        i = 0,
        responseObject,
        yelpBusiness,
        BusinessModel,
        model;

    // BusinessModel class
    BusinessModel = V1Response.getBusinessModel();

    // Response object
    responseObject = V1Response.getResponse();
    responseObject.source = 'yelp';

    for (i in yelpResponse.businesses) {

      // Yelp business object
      yelpBusiness = yelpResponse.businesses[i];

      // New BusinessModel instance
      model = new BusinessModel();
      model.name    = yelpBusiness.name;
      model.address = yelpBusiness.location.display_address[0];
      model.city    = yelpBusiness.location.city;
      model.state   = yelpBusiness.location.state_code;
      model.phone   = yelpBusiness.phone;
      model.zip     = yelpBusiness.location.postal_code;

      // Adds model to response data
      data.push(model);
    }

    // Sets data
    responseObject.data = data;

    // Returns response object
    return responseObject;
  }

  /**
   * Public module object that will be exported
   * @type {Object}
   */
  var module = {};

  /**
   * Searches venue by geographical location
   * 
   * @param  {String} term Search term
   * @param  {Decimal} lat  Latitude
   * @param  {Decimal} lon  Longitude
   * @return {Object}       Promise object
   */
  module.search = function yelpSearch(term, lat, lon, radius, limit) {

    // Variable declarations
    var deferred, params, ll, cfg, yelp;

    /**
     * Config & YELP package:
     * Both vars to be defined here because sails is only in this context
     */
    cfg = sails.config.apiServices.yelp;
    yelp = require('yelp').createClient({
      consumer_key: cfg.consumer_key,
      consumer_secret: cfg.consumer_secret,
      token: cfg.token,
      token_secret: cfg.token_secret,
    });

    // Using Q to promisify this method
    deferred = Q.defer();

    // Formatting lat and long
    ll  = lat + ',' + lon;

    // URL Params
    params = {
      'term': 'coffee',
      'll': ll,
    };

    if (limit) {
      params.limit = limit;
    }

    /**
     * Request callback, resolves or rejects promise
     * @param  {Object} error    Only present if there is an error
     * @param  {Object} response Response object
     * @param  {Object} body     JSON Object of response
     * @return {Object}          Q.deferred reject() or resolve()
     */
    function requestCallback(error, body) {

      // Makes sure there are no errors
      if (error) {
        return deferred.reject(error, body);
      }

      // Resolves promise
      deferred.resolve(transformResponse(body));
    }

    // See http://www.yelp.com/developers/documentation/v2/search_api
    yelp.search(params, requestCallback);

    // Returns "Q" promise
    return deferred.promise;
  };

  /**
   * Exports public module object
   */
  return module;

})();


// Finally exports Yelp service
module.exports = YelpService;

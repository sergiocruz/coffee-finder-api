
// Dependencies
var Q = require('q');

/**
 * Yelp service module
 * @type {Object}
 */
var YelpService = {

  /**
   * Searches venue by geographical location
   * 
   * @param  {String} term Search term
   * @param  {Decimal} lat  Latitude
   * @param  {Decimal} lon  Longitude
   * @return {Object}       Promise object
   */
  search: function(term, lat, lon, radius, limit) {

    // Vars
    var deferred, params, url, ll;

    // Using Q to promisify this method
    deferred = Q.defer();

    // YELP package
    var cfg = sails.config.apiServices.yelp;
    var yelp = require('yelp').createClient({
      consumer_key: cfg.consumer_key,
      consumer_secret: cfg.consumer_secret,
      token: cfg.token,
      token_secret: cfg.token_secret,
    });


    // Formatting lat and long
    lat = parseFloat(lat).toPrecision(6);
    lon = parseFloat(lon).toPrecision(6);

    // Formatting to pass as a url param
    ll = lat + "," + lon;

    // URL Params
    params = {
      'term': 'coffee',
      'll': ll,
    };

    if (limit) {
      params.limit = limit;
    }

    // See http://www.yelp.com/developers/documentation/v2/search_api
    yelp.search(params, requestCallback);

    // // URL Params
    // params = {
    //   'ywsid': sails.config.apiServices.yelp.ywsid,
    //   'term': term,
    //   'lat': lat,
    //   'long': lon,
    //   'radius': radius
    // };

    // // API url and params
    // url = 'http://api.yelp.com/business_review_search/?' +
    //     qs.stringify(params);

    // /**
    //  * Executes YELP request
    //  */
    // request.get({url: url, json: true}, requestCallback);

    // console.log(url);
    // console.log('start', Date.now());

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
        return deferred.reject();
      }

      // Resolves promise
      deferred.resolve(YelpService.transformResponse(body));
    }

    // Returns "Q" promise
    return deferred.promise;
  },

  transformResponse: function(yelpResponse) {

    var responseObject, i, yelpBusiness, data = [];

    // Response object
    var responseObject = V1Response.getResponse();

    for (i in yelpResponse.businesses) {

      // Yelp business object
      yelpBusiness = yelpResponse.businesses[i];


      // Model
      model = V1Response.getBusinessModel();
      model.name = yelpBusiness.name;
      model.address = yelpBusiness.address1;
      model.city = yelpBusiness.city;
      model.state = yelpBusiness.state;
      model.phone = yelpBusiness.phone;
      model.zip = yelpBusiness.zip;

      // Adds model to response data
      data.push(model);
    }

    // Sets data
    responseObject.data = data;

    // Returns response object
    return responseObject;
  }
};

// Finally exports Yelp service
module.exports = YelpService;

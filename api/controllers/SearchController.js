'use strict';

/**
 * SearchController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var SearchController = {

  /*
   * Index controller for our v1 api
   * 
   * Sample JSON response:
   *  'data': [{
   *    address: "706 W Smith St",
   *    city: "Orlando",
   *    name: "Downtown Credo Coffee",
   *    phone: "4072504888",
   *    state: "FL",
   *    zip: "32804"
   *  }]
   */
   
  index: function searchIndex(req, res) {

    // TODO: Make CORS vars work globally
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Connection', 'Keep-Alive');
    res.set('Keep-Alive', 'timeout=10, max=50');

    var term = req.query.term || '',
        lat = req.query.lat || '',
        lon = req.query.lon || '',
        radius = req.query.radius || '',
        limit = req.query.limit || '';

    // Validating input
    // TODO: Validate lat and lon are numerical
    if (!(term && lat && lon && radius)) {
      return sails.config[403]('Invalid input fields', req, res);
    }

    // Formatting lat and lon
    lat = parseFloat(lat).toPrecision(5);
    lon = parseFloat(lon).toPrecision(5);

    // Tries to find venue from cache first
    // TODO: Promisify this
    Venue.find({
      'lat': parseFloat(lat),
      'lon': parseFloat(lon)
    }).done(function(err, venues) {

      // Finds directly from service
      if (err || !venues.length) {
        return buildFromService();
      }

      // Shoes response directly from cache
      return buildFromCache(venues);
    });

    /**
     * Finds from venue from 3rd party service
     */
    function buildFromService() {

      // var service = parseInt(Math.random() * 2, 10) ? FoursquareService : YelpService;

      // Searches from service
      // TODO: Promisify everything!
      YelpService.search(term, lat, lon, radius, limit)
        .then(function searchIndexResponse(response) {

          Log
            .create({
              uri: req.url,
              request: req.query,
              response: response
            })
            .done(function(err, data) {

              if (data.response.data.length) {
                Venue.create({
                  lat: lat,
                  lon: lon,
                  name: data.response.data[0].name,
                  address: data.response.data[0].address,
                  city: data.response.data[0].city,
                  state: data.response.data[0].state,
                  phone: data.response.data[0].phone,
                  zip: data.response.data[0].zip
                }).done(function(){
                  buildJson(response);
                });
              } else {
                buildJson(response);
              }

            });

        })
        .catch(function(error) {
          buildJson(error);
        });
    }

    /**
     * Shows cached response
     * @param  {Array} venues Array of venues
     */
    function buildFromCache(venues) {

      // Formatting response
      var response = V1Response.getResponse();
      var BusinessModel = V1Response.getBusinessModel();

      // Specifies where data is coming from
      response.source = 'cache';

      // Loops through venues and formats them accordantly
      venues.forEach(function(eachVenue) {
        // New BusinessModel instance
        var model = new BusinessModel();
        model.name    = eachVenue.name;
        model.address = eachVenue.address;
        model.city    = eachVenue.city;
        model.state   = eachVenue.state;
        model.phone   = eachVenue.phone;
        model.zip     = eachVenue.postalCode;

        // Pushes to response data
        response.data.push(model);
      });

      buildJson(response);
    }

    function buildJson(response) {

      // Log analytical data

      res.json(response);
    }


  }
  
};

module.exports = SearchController;

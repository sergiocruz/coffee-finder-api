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
    if (!(term && lat && lon && radius)) {
      return sails.config[403]('Invalid input fields', req, res);
    }

    var service = parseInt(Math.random() * 2, 10) ? FoursquareService : YelpService;

    service.search(term, lat, lon, radius, limit)
      .then(function searchIndexResponse(response) {


        Log
          .create({
            uri: req.url,
            request: req.query,
            response: response
          })
          .done(function(err, data) {
            res.json(response);
          });

      })
      .catch(function(error) {
        res.json(error);
      });

  }
  
};

module.exports = SearchController;

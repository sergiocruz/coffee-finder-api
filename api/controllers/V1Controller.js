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


var V1Controller = {

  index: function(req, res) {

    // Standarized response object
    var response = {
      data: null
    };

    // console.log(req.query);

    var term = req.query.term || '',
        lat = req.query.lat || '',
        lon = req.query.lon || '',
        radius = req.query.radius || '';

    // Validating input
    if (!(term && lat && lon && radius)) {
      return sails.config[403]('Invalid input fields', req, res);
    }

    YelpService.search(term, lat, lon, radius)
      .then(function(response) {
        res.json(response);
      });

  }

  
};

module.exports = V1Controller;
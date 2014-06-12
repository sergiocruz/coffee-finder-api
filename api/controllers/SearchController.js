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

  /**
   * Index controller for our v1 api
   */
  index: function searchIndex(req, res) {

    res.set('Access-Control-Allow-Origin', '*');

    var term = req.query.term || '',
        lat = req.query.lat || '',
        lon = req.query.lon || '',
        radius = req.query.radius || '';

    // Validating input
    if (!(term && lat && lon && radius)) {
      return sails.config[403]('Invalid input fields', req, res);
    }

    YelpService.search(term, lat, lon, radius)
      .then(function searchIndexResponse(response) {
        res.json(response);
      });

  }
  
};

module.exports = SearchController;
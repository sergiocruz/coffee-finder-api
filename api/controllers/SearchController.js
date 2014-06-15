"use strict";

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
    res.set('Connection', 'Keep-Alive');
    res.set('Keep-Alive', 'timeout=10, max=50');

    /*
    Accept-Ranges:bytes
    Access-Control-Allow-Origin:*
    Connection:Keep-Alive
    Content-Encoding:gzip
    Content-Type:application/json; charset=utf-8
    Date:Thu, 12 Jun 2014 19:04:17 GMT
    Keep-Alive:timeout=10, max=50
    Server:nginx
    Strict-Transport-Security:max-age=864000
    Tracer-Time:132
    Transfer-Encoding:chunked
    Vary:Accept-Encoding,User-Agent,Accept-Language
    Via:1.1 varnish
    X-Cache:MISS
    X-Cache-Hits:0
    X-ex:fastly_cdn
    X-RateLimit-Limit:5000
    X-RateLimit-Remaining:4998
    X-Served-By:cache-jfk1030-JFK
     */

    var term = req.query.term || '',
        lat = req.query.lat || '',
        lon = req.query.lon || '',
        radius = req.query.radius || '',
        limit = req.query.limit || '';

    // Validating input
    if (!(term && lat && lon && radius)) {
      return sails.config[403]('Invalid input fields', req, res);
    }

    // return res.json({
    //   'data': [{
    //     address: "706 W Smith St",
    //     city: "Orlando",
    //     name: "Downtown Credo Coffee",
    //     phone: "4072504888",
    //     state: "FL",
    //     zip: "32804"
    //   }]
    // });

    YelpService.search(term, lat, lon, radius, limit)
      .then(function searchIndexResponse(response) {
        res.json(response);
      });

  }
  
};

module.exports = SearchController;
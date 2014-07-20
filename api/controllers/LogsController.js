'use strict';

/**
 * AdminController
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

var LogsController = {

  index: function(req, res) {
    res.view();
  },

  api: function(req, res) {

    var response = {};

    var logs = Log.find();

    var limit = req.param('limit');
    var sortField = req.param('sortField');
    var sortDir = req.param('sortDir');
    var page = req.param('page');

    // Limit
    if (limit) {
      logs.limit(limit);

      if (page > 1) {
        logs.skip(limit * (page - 1));
      }
    }



    // Sorting
    var sortInfo = {};
    if (sortField && sortDir) {
      sortInfo[sortField] = sortDir;
    } else {
      sortInfo.createdAt = 'desc';
    }

    // Sort logs
    logs.sort(sortInfo);


    logs.done(function(err, logs) {

        // Data
        response.data = logs;

        // Counting rows
        Log.count().done(function(err, count) {

          response.totalCount = count;

          // Response
          res.json(response);
        });

      });

  }
};

module.exports = LogsController;

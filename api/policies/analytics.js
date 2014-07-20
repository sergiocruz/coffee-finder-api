'use strict';

/**
 * analytics
 *
 * @module      :: Policy
 * @description :: Saves requests that come through the site
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
function AnalyticsPolicy(req, res, next) {

  var ua = require('universal-analytics'),
      visitor = ua(sails.config.analytics.tid);

  /**
   * Data sent to GA
   * @see {@link https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters|Google Analytics}
   * @type {Object}
   */
  var data = {
    uip: req.ip,
    ua: req.get('user-agent'),
    t: 'pageview',
    dh: 'coffee.bringitfast.com',
    dp: req.originalUrl,
    an: 'Coffee Finder'
  };

  console.log(data);

  // Saves pageview to GA
  visitor.pageview(data, function analyticsPolicyPageview(err) {
    if (err) {
      console.log('err', err);
    }

    // Callback
    next();
  });
}

// Exports AnalyticsPolicy module
module.exports = AnalyticsPolicy;
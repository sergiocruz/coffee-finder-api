'use strict';

/**
 * V1 Response Module
 * 
 * Just a simple way of consolidating our API regardless of third-party
 * service being used, used in the v1 of our application Restful API.
 *
 * @return {Object} Public V1Response module
 */
var V1Response = (function V1ResponseModule() {

  /**
   * Busines model private class
   */
  function BusinessModel() {
    this.name = '';
    this.address = '';
    this.city = '';
    this.state = '';
    this.phone = '';
    this.zip = '';
  }

  /**
   * Public module
   * @type {Object}
   */
  var module = {};

  /**
   * getResponse()
   * 
   * Gets response, right now only data but more important fields
   * may be added in the soon future
   * 
   * @return {Object} Response object
   */
  module.getResponse = function getResponse() {
    return {
      source: '',
      data: []
    };
  };

  /**
   * getBusinessModel()
   * 
   * Returns business model, for consolidation purposes.
   * At this point including the following fields:
   * - name (business name)
   * - address (business address)
   * - city (business city)
   * - state (business abbreviated state)
   * - phone (business phone number)
   * - zip (business zip code)
   * 
   * @return {Object} Model for business location
   */
  module.getBusinessModel = function getBusinessModel() {
    return BusinessModel;
  };

  /**
   * Returns public object
   */
  return module;
})();

// Exports module
module.exports = V1Response;

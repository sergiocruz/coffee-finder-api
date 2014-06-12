/**
 * V1 Response Module
 * 
 * Just a simple way of consolidating our API regardless of third-party
 * service being used, used in the v1 of our application Restful API.
 */
var V1Response = {

  /**
   * getResponse()
   * 
   * Gets response, right now only data but more important fields
   * may be added in the soon future
   * 
   * @return {Object} Response object
   */
  getResponse: function getResponse() {
    return {
      data: []
    }
  },

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
  getBusinessModel: function getBusinessModel() {
    return {
      name: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      zip: ''
    }
  }
};

// Exports module
module.exports = V1Response;

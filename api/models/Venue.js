/**
 * Venue
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var VenueModel = {

  attributes: {
    lat: {
      type: 'float',
      required: true
    },

    lon: {
      type: 'float',
      required: true
    },

    name: {
      type: 'string',
      required: true
    },

    address: {
      type: 'string',
      required: true
    },

    city: {
      type: 'string',
      required: true
    },

    zip: {
      type: 'string',
      required: true
    },

    state: {
      type: 'string',
      required: true
    },

    phone: {
      type: 'string'
    }
  }

};

module.exports = VenueModel;
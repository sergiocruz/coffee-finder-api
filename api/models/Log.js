/**
 * Log
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  adapter: 'mongo',

  attributes: {
    uri: 'string',
    request: 'json',
    response: 'json'
  }

};

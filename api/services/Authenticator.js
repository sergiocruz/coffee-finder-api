'use strict';

/**
 * Authenticator module
 * @return {Object}
 */
var Authenticator = (function AuthenticatorModule() {

  // Dependencies & declarations
  var bcrypt = require('bcrypt'),
      Q = require('q'),
      module = {};

  /**
   * Login method
   * @param  {String} username
   * @param  {String} password
   * @return {Object} Q Promise
   */
  module.login = function login(username, password) {

    // Declarations
    var deferred;

    // Using Q to promisify this method
    deferred = Q.defer();

    // Searches for user
    User.findOneByUsername(username).done(function authenticateFind(err, user) {

      if (err) {
        return deferred.reject('Unkown error.');
      }

      // User not found
      if (!user) {
        return deferred.reject('User not found');
      }

      // Comparing password
      bcrypt.compare(password, user.password, function authenticateCompare(err, match) {

        if (err) {
          return deferred.reject('Server error');
        }

        if (match) {
          return deferred.resolve(user);
        }

        return deferred.reject('Invalid password');

      });
    });

    // Return Q promise
    return deferred.promise;

  }; // end of module.login()

  /**
   * Returns public module
   */
  return module;

})();

module.exports = Authenticator;

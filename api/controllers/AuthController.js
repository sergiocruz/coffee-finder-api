'use strict';

/**
 * AuthController
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

var AuthController = {

  index: function authController(req, res) {

    // Redirects if already logged in
    if (req.session.authenticated) {
      return res.redirect('/logs');
    }

    var username = req.body.username || '',
        password = req.body.password || '',
        feedback = '';

    // Do login if username and password are here
    if (username && password) {

      // Do login
      Authenticator.login(username, password)
        .then(onAuth)
        .catch(onAuthError);
      
    } else {
      next();
    }

    function next() {
      res.view({
        username: username,
        password: password,
        feedback: feedback
      });
    }

    function onAuth() {
      req.session.authenticated = true;
      res.redirect('/logs');
      // next();
    }

    function onAuthError(reason) {
      feedback = reason;
      next();
    }

  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AuthController)
   */
  _config: {}

  
};

module.exports = AuthController;

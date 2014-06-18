/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var User = {

  adapter: 'mongo',

  attributes: {
    
    username: {
      type: 'string',
      unique: true,
      required: true
    },

    password: {
      type: 'string',
      required: true
    }
  },

  beforeCreate: function beforeUserCreate(attrs, next) {

    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function beforeUserCreateGenSalt(err, salt) {
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function beforeUserCreateGenSaltHash(err, hash) {
        if (err) return next(err);

        attrs.password = hash;
        next();
      });
    });
  }

};

module.exports = User;

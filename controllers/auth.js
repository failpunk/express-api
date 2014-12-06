var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));
var jwt      = require('jsonwebtoken');

/**
 * Auth Controller Logic
 *
 * @param app
 * @returns {{authenticate: authenticate, secret: string}}
 * @constructor
 */
var AuthCtrl = function(app) {

  var secret = '12345';

  var userSchema = require("../models/user.js");
  var User = app.get('bookshelf').Model.extend(userSchema.proto, userSchema.props);

  function authenticate(req, res) {

    if (!req.body.email | !req.body.password) {
      return res.status(401).send('Email and password are both required');
    }

    User.getByEmail(req.body.email)
      .then(function(user) {
        bcrypt.compare(req.body.password || "", user.get('password'), function(err, isMatching) {
          if(isMatching) {
            delete user.attributes.password;    // remove password before returning

            var token = jwt.sign(user.toJSON(), secret, { expiresInMinutes: 5 });
            debugger;
            return res.json({ token: token });
          } else {
            return res.status(401).send('Wrong user or password');
          }
        });
      })
      .catch(function(err) {
        res.sendStatus(404);
      })
  }

  return {
    authenticate: authenticate,
    secret: secret
  }

};

module.exports = AuthCtrl;
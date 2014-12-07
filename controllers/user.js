var Promise  = require('bluebird');
var util     = require('util');


/**
 * User Controller Logic
 *
 * @param app
 * @returns {{authenticate: authenticate, secret: string}}
 * @constructor
 */
var UserCtrl = function(app) {

  var secret = '12345';

  var userSchema = require("../models/user.js");
  var User = app.get('bookshelf').Model.extend(userSchema.proto, userSchema.props);

  var getUser = function(id) {
    return User
      .where({id: id})
      .fetch({require: true});
  };

  /*
   * Authenticate
   */
  function authenticate(req, res) {

    if (!req.body.email | !req.body.password) {
      return res.status(401).send('Email and password are both required');
    }

    User.getByEmail(req.body.email)
      .then(function(user) {

        if(user.checkPassword(req.body.password || "")) {
          return res.json({ token: user.generateToken(secret) });
        } else {
          return res.status(401).send('Incorrect user or password');
        }
      })
      .catch(function(err) {
        res.status(404).send(util.format('User with email %s not found', req.body.email));
      })
  }


  /*
   * Register a User
   */
  function register(req, res) {
    if(!req.body.email || !req.body.password) {
      return res.status(400).send('Username and password are required');
    }

    User.getByEmail(req.body.email)
      .then(function(user) {
        return res.status(400).send('User already exists for this email');
      })
      .catch(function(err) {
        if (err.message === 'EmptyResponse') {
          User.register(req.body)
            .then(function(user) {
              return res.send(util.format('New user created for %s', user.get('email')));
            })
            .catch(function(err) {
              console.log(err);
            });
        } else {
          throw err;
        }
      });
  }

  /*
   * Get a User
   */
  function get(req, res) {
    getUser(req.params.id)
      .then(function(user) {
        res.send(user || {});
      })
      .catch(function(err) {
        res.sendStatus(404);
      })
  }

  return {
    authenticate: authenticate,
    register: register,
    get: get,
    secret: secret
  }

};

module.exports = UserCtrl;
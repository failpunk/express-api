var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

module.exports = function (app) {


  /*
   * Global Middleware
   */
  app.use(bodyParser.json());

  var secret = '12345';

  app.use('/api', expressJwt({secret: secret}));

  app.use(function(err, req, res, next){
    // catch authorization errors
    if (err.constructor.name === 'UnauthorizedError') {
      res.status(401).send(err.inner);
    }
  });

  /*
   * Todo Endpoints
   */

  // Get the model
  var Todo = app.get('bookshelf').Model.extend(require("../models/todo.js"));

  // all todos
  app.get('/api/todos', function (req, res) {
    Todo
      .fetchAll()
      .then(function(model) {
        res.send(model);
      });
  });

  // one todo
  app.get('/api/todos/:id', function (req, res) {
    Todo
      .where({id: req.params.id})
      .fetch({require: true})
      .then(function(todo) {
        res.send(todo || {});
      })
      .catch(function(err) {
        res.sendStatus(404);
      });
  });


  /*
   * User Endpoints
   */

  // Get the model
  var userSchema = require("../models/user.js");
  var User = app.get('bookshelf').Model.extend(userSchema.proto, userSchema.props);

  var getUser = function(id) {
    return User
      .where({id: id})
      .fetch({require: true});
  }

  // get user
  app.get('/api/users/:id', function (req, res) {
    getUser(req.params.id)
      .then(function(user) {
        res.send(user || {});
      })
      .catch(function(err) {
        res.sendStatus(404);
      });
  });


  /*
   * Auth Endpoints
   */

  app.post('/auth', function (req, res) {

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
  });

}
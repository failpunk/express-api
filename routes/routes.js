var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');

module.exports = function (app) {

  var CONTROLLERS = '../controllers/';
  var AuthCtrl = require(CONTROLLERS + 'auth')(app);


  /*
   * Global Middleware
   */
  app.use(bodyParser.json());

  app.use('/api', expressJwt({secret: AuthCtrl.secret}));

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

  app.post('/auth', AuthCtrl.authenticate);

}
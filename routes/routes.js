var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

module.exports = function (app) {


  /*
   * Global Middleware
   */
  app.use(bodyParser.json());



  /*
   * User Endpoints
   */

  // Get the model
  var Todo = app.get('bookshelf').Model.extend(require("../models/todo.js"));

  // all todos
  app.get('/todos', function (req, res) {
    Todo
      .fetchAll()
      .then(function(model) {
        res.send(model);
      });
  });

  // one todo
  app.get('/todos/:id', function (req, res) {
    Todo
      .where({id: req.params.id})
      .fetch({require: true})
      .then(function(todo) {
        console.log('todo',todo);
        res.send(todo || []);
      })
      .catch(function(err) {
        res.sendStatus(404);
      });
  });


  /*
   * Auth Endpoints
   */

  var secret = '12345';

  app.use('/api', expressJwt({secret: secret}));

  app.post('/auth', function (req, res) {
    //TODO validate req.body.username and req.body.password
    //if is invalid, return 401
    if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
      res.status(401).send('Wrong user or password');
      return;
    }

    var profile = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com',
      id: 123
    };

    // We are sending the profile inside the token
    var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

    res.json({ token: token });
  });

}
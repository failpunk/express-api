var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');

module.exports = function (app) {

  var CONTROLLERS = '../controllers/';
  var UserCtrl = require(CONTROLLERS + 'user')(app);
  var TodoCtrl = require(CONTROLLERS + 'todo')(app);


  /*
   * Global Middleware
   */
  app.use(bodyParser.json());

  app.use('/api', expressJwt({secret: UserCtrl.secret}));

  app.use(function(err, req, res, next){
    // catch authorization errors
    if (err.constructor.name === 'UnauthorizedError') {
      res.status(401).send(err.inner);
    }
  });


  /*
   * Todos Endpoints
   */

  app.get('/api/todos', TodoCtrl.all);
  app.get('/api/todos/:id', TodoCtrl.one);


  /*
   * User Endpoints
   */

  app.post('/register', UserCtrl.register);
  app.post('/auth', UserCtrl.authenticate);
  app.post('/api/users/:id', UserCtrl.get);

}
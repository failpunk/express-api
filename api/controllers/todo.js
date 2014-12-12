

/**
 * TodoCtrl Controller Logic
 *
 * @param app
 * @returns {{authenticate: authenticate, secret: string}}
 * @constructor
 */
var TodoCtrl = function(app) {

  // Get the model
  var todoSchema = require("../models/todo.js");
  var Todo = app.get('bookshelf').Model.extend(todoSchema.proto, todoSchema.props);


  /*
   * Get all todos
   */
  function all(req, res) {
    Todo
      .fetchAll()
      .then(function(model) {
        res.send(model);
      });
  }

  function one(req, res) {
    Todo
      .where({id: req.params.id})
      .fetch({require: true})
      .then(function(todo) {
        return res.send(todo || {});
      })
      .catch(function(err) {
        console.log(err);
        return res.sendStatus(404);
      });
  }

  return {
    all: all,
    one: one
  }

};

module.exports = TodoCtrl;
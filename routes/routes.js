module.exports = function (app) {

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

}
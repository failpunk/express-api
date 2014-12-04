var dbConfig = {
  client: 'sqlite3',
  connection: {
    filename: "./sqlite/db"
  }
};

var express = require('express');
var app = express();
var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

app.set('bookshelf', bookshelf);

require('./routes/routes')(app);

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
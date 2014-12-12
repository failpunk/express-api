'use strict';

var request = require('supertest');
var express = require('express');
var expect = require('expect.js')
var jwt = require('jsonwebtoken');
var app = require('../api/api').app;

var testEmail = 'failpunk@gmail.com';
var token;


describe('Authorization', function(){

  it('should fail authorization', function(done){
    request(app)
      .post('/auth')
      .expect('Email and password are both required')
      .expect(401, done);
  })

  it('should not find user', function(done){
    request(app)
      .post('/auth')
      .send({ email: 'nope', password: 'bad' })
      .expect('User with email nope not found')
      .expect(404, done);
  })

  it('should have bad password', function(done){
    request(app)
      .post('/auth')
      .send({ email: 'failpunk@gmail.com', password: 'bad' })
      .expect('Incorrect user or password')
      .expect(401, done);
  })

  it('should return a valid token', function(done){
    request(app)
      .post('/auth')
      .send({ email: testEmail, password: 'bacon' })
      .expect(hasValidToken)
      .expect(200, done);
  })
});


describe('Todos', function(){

  it('should be unauthorized', function(done){
    request(app)
      .get('/api/todos')
      .expect(401, done);
  })

  it('should return todos', function(done){
    request(app)
      .get('/api/todos')
      .set('Authorization', 'Bearer ' + token)
      .expect(returnsValidTodos)
      .expect(200, done);
  })

  it('should return requested todo', function(done){
    request(app)
      .get('/api/todos/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(function(res) {return isValidTodo(res.body)})
      .expect(200)
      .end(function(err, res){
        if (err) throw err;
        expect(res.body.id).to.eql(1);    // correct id
        done();
      })
  })

});

/*
 * Test Functions
 */

function hasValidToken(res) {
  var decoded = jwt.decode(res.body.token);

  // save for later
  token = res.body.token;

  if (!('token' in res.body)) return "missing token key";
  if (!('email' in decoded)) return "bad token returned";
  if (!(testEmail == decoded.email)) return "email does not match";
}

function returnsValidTodos(res) {
  if (!(res.body.length)) return 'has no todos';

  return isValidTodo(res.body.pop());
}

function isValidTodo(todo) {
  if (!('id' in todo)) return 'todo missing id';
  if (!('name' in todo)) return 'todo missing name';
  if (!('completed' in todo)) return 'todo missing completed';
}
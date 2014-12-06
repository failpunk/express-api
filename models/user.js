var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));

module.exports = {

  proto:  {
    tableName: 'user',

    login: Promise.method(function(password) {
      if (!email || !password) throw new Error('Email and password are both required');

      return new this({email: email.toLowerCase().trim()}).fetch({require: true}).tap(function(customer) {
        return bcrypt.compareAsync(customer.get('password'), password);
      });
    })

  },

  props: {

    getByEmail: function(email) {
      if (!email) throw new Error('Email is required');

      return this
        .where({email: email})
        .fetch({require: true});
    }

  }

}
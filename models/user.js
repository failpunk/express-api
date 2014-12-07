var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));
var jwt      = require('jsonwebtoken');

module.exports = {

  proto:  {

    tableName: 'user',

    /*
     * Lookup user and check password
     */
    checkPassword: function(password) {
      return bcrypt.compareSync(password, this.get('password'));
    },

    /*
     * Generate a JTW token for this user, without the password hash
     */
    generateToken: function(secret) {
      return jwt.sign(this.omit('password'), secret, { expiresInMinutes: 5 });
    }

  },

  props: {

    getByEmail: function(email) {
      if (!email) throw new Error('Email is required');

      return this
        .where({email: email})
        .fetch({require: true});
    },

    register: function(userData) {
      userData.password = bcrypt.hashSync(userData.password, 10);

      return new this(userData).save();
    }

  }

}
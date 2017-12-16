'use strict';

import {Schema, model} from 'mongoose';
import * as crypto from 'crypto';

const UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  provider: {
    type: String,
    default: 'local'
  },
  salt: {
    type: String
  }
});

//user profile
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      username: this.username,
      role: this.role
    }
  });

//user token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      _id: this._id,
      role: this.role
    }
});

//validate username
UserSchema
  .path('username')
  .validate(async function(val) {
    try {
      const user = await this.constructor.findOne({username: val});
      if(user) {
        if(this.id === user.id) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } catch(err) {
      throw err;
    }
  }, 'Username is already in use');

const validatePresenceOf = value => {
  return value && value.length;
};

UserSchema
  .pre('save', function(next) {
    if(!this.isModified('password')) {
      return next;
    }
    if(!validatePresenceOf(this.password)) {
      return next;
    }

    this.makeSalt()
      .then(salt => {
        this.salt = salt;
      })
      .then(() => {
        return this.encryptPassword(this.password);
      })
      .then(hashedPassword => {
        this.password = hashedPassword;
        return next();
      });
  });

UserSchema.methods = {
  makeSalt: async function makeSalt() {
    try {
      const bytes = 16;

      let salt = await crypto.randomBytes(bytes).toString('base64');
      return salt;
    } catch(err) {
      throw err;
    }
  },
  encryptPassword: async function encryptPassword(password) {
    try {
      const defaultIterations = 10000;
      const defaultKeyLength = 64;
      const salt = new Buffer(this.salt, 'base64');

      let key = await crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha256').toString('base64');
      return key;
    } catch(err) {
      throw err;
    }
  },
  authenticate: async function authenticate(password) {
    try {
      let pwgen = await this.encryptPassword(password);
      if(this.password === pwgen) {
        return true;
      } else {
        return false;
      }
    } catch(err) {
      throw err;
    }
  }
};

export default model('User', UserSchema, 'user');

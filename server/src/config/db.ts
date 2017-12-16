'use strict';

import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
(<any>mongoose).Promise = Promise;

const mongo = {
  options: {
    useMongoClient: true
  },
  url: 'mongodb://localhost/db'
}

export class DBConfig {
  static init() {
    mongoose.connect(mongo.url, mongo.options);
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
      process.exit(-1);
    });
  }
}

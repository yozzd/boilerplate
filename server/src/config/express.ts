'use strict';

import * as express from 'express';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as compression from 'compression';
import * as zlib from 'zlib';
import * as passport from 'passport';

export class ExpressConfig {
  static init(app: express.Application): void {
    app.use(helmet());
    app.use(compression({
      level: zlib.Z_BEST_COMPRESSION,
      threshold: "1kb"
    }));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(passport.initialize());
  }
}

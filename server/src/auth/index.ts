'use strict';

import * as express from 'express';
import User from '../api/user/user.model';
import * as passport from './auth.passport';
import {Controller} from './auth.controller';

passport.setup(User);

export class AuthRoutes {
  static init(router: express.Router) {
    router
      .route('/auth/local')
      .post(Controller.token);
  }
}

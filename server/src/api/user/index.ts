'use strict';

import * as express from 'express';
import {AuthService} from '../../auth/auth.service';
import {Controller} from './user.controller';

export class UserRoutes {
  static init(router: express.Router) {
    router
      .route('/api/user')
      .get(AuthService.hasRole('admin'), Controller.index)
      .post(Controller.create);

    router
      .route('/api/user/:id')
      .get(AuthService.isAuthenticated(), Controller.show)
      .delete(AuthService.hasRole('admin'), Controller.remove);

    router
      .route('/api/user/:id/password')
      .put(AuthService.isAuthenticated(), Controller.changePassword);
  }
}

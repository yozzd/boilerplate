'use strict';

import * as express from 'express';
import {UserRoutes} from './api/user';
import {AuthRoutes} from './auth';
import * as path from 'path';
import config from './config';

export class Routes {
  static init(app: express.Application, router: express.Router) {
    app.use('/', router);

    UserRoutes.init(router);
    AuthRoutes.init(router);

    /*app.use(express.static(config.rootDir + '/client/dist'));
    app.route('*')
      .get((req: express.Request, res: express.Response) => {
        res.sendFile(path.join(config.rootDir + '/client/dist/index.html'));
      });*/
  }
}

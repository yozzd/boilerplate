'use strict';

import * as express from 'express';
import * as http from 'http';
import {DBConfig} from './config/db'
import {ExpressConfig} from './config/express'
import {Routes} from './routes'

const PORT = 3000;
const app = express();

DBConfig.init();
ExpressConfig.init(app);
Routes.init(app, express.Router());

http.createServer(app)
  .listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
  });

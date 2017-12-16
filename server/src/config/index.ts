'use strict';

import * as path from 'path';

const config = {
  userRoles: ['guest', 'user', 'admin'],
  secrets: {
    session: 'super-secret'
  },
  rootDir: path.normalize(`${__dirname}/../../..`)
}

export default config;

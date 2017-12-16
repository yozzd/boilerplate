'use strict';

import * as express from 'express';
import config from '../config';
import * as compose from 'composable-middleware';
import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
import User from '../api/user/user.model';

const validateJwt = expressJwt({
  secret: config.secrets.session
});

export class AuthService {
  static signToken(id, role) {
    return jwt.sign({
      _id: id,
      role: role
    }, config.secrets.session, {
      expiresIn: 60 * 60 * 5
    });
  }

  static isAuthenticated() {
    return compose()
      .use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        validateJwt(req, res, next);
      })
      .use(async (err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          if (err.name === 'UnauthorizedError') {
            res.status(401).json({
              message:'No authorization token was found'
            });
          } else {
            const user = await User.findById(req.user._id);
            if(!user) {
              return res.status(401).json({
                message: 'Cannot find the user'
              });
            }
            req.user = user;
            next();
          }
        } catch(err) {
          next(err);
        }
    });
  }

  static hasRole(roleRequired) {
    if(!roleRequired) {
      throw new Error('Required role needs to be set');
    }

    return compose()
      .use(AuthService.isAuthenticated())
      .use(function meetsRequirements(req: express.Request, res: express.Response, next: express.NextFunction) {
        if(config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
          return next();
        } else {
          return res.status(403).json({
            message: "Access Denied/Forbidden"
          });
        }
      });
  }
}

'use strict';

import * as express from 'express';
import User from './user.model';

interface IUser {
  _id?: any,
  salt?: string,
  username?: string,
  password?: string,
  __v?: number,
  provider?: string,
  role?: string,
  profile?: Function
  authenticate?: Function,
  save?: Function
}

export class Controller {
  static async index(req: express.Request, res: express.Response): Promise<void> {
    try {
      const users = await User.find({}, '-salt -password -provider');
      res.status(200).json(users);
    } catch(err) {
      res.status(400).json(err);
    }
  }

  static async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const newUser = new User(req.body);
      const saved = await newUser.save();
      res.status(200).json({
        message: 'New user succesfully created'
      });
    } catch(err) {
      res.status(400).json(err);
    }
  }

  static async show(req: express.Request, res: express.Response): Promise<void> {
    try {
      let user = <IUser>{};
      user = await User.findById(req.params.id);
      if(!user) {
        res.status(404).end();
      } else {
        res.status(200).json(user.profile);
      }
    } catch(err) {
      res.status(400).json({
        message: 'Sorry, cannot find the user'
      });
    }
  }

  static async remove(req: express.Request, res: express.Response): Promise<void> {
    try {
      const remove = await User.findByIdAndRemove(req.params.id);
      res.status(200).json({
        message: 'User deleted'
      });
    } catch(err) {
      res.status(400).json(err);
    }
  }

  static async changePassword(req: express.Request, res: express.Response): Promise<void> {
    try {
      let user = <IUser>{}
      user = await User.findById(req.params.id);
      const auth = await user.authenticate(req.body.oldPassword);
      if(auth) {
        user.password = req.body.newPassword;
        const save = await user.save();
        res.status(200).json({
          message: 'Password has change successfully'
        });
      } else {
        res.status(403).json({
          message: 'Sorry, your old password doesn\'t match'
        });
      }
    } catch(err) {
      res.status(400).json(err);
    }
  }
}

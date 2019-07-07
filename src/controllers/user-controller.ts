/*
 * Copyright (c) 2019 Ali I. Avci
 */

import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';

import { Logger } from '@overnightjs/logger';

import { NextFunction, Request, Response } from 'express';

import passport = require('passport');

import { User } from '@models';

@Controller('api/user')
export class UserController {

  @Get()
  private async getUsers(req: Request, res: Response, next: NextFunction) {
    if (req.isUnauthenticated) {
      res.send('Please login');
    }

    try {
      const allUsers = await User.find();

      res.send(allUsers);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user with [id] param
   *
   * @param req HTTP request
   * @param res HTTP response
   */
  @Get(':id')
  private async getUser(req: Request, res: Response, next: NextFunction) {
    Logger.Info('The logged in user is', req.user);
    Logger.Info(req.params.id);

    try {
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  }

  @Post('login')
  @Middleware(passport.authenticate('local'))
  private async performLogin(req: Request, res: Response, next: NextFunction) {
    Logger.Info('Performing login');

    return res.send(req.sessionID);
  }

  @Get('logout')
  private async performLogout(req: Request, res: Response, next: NextFunction) {
    
    req.logout();

    return res.send(req.user);
  }

  @Put()
  public async putUser(req: Request, res: Response, next: NextFunction) {
    Logger.Info('Updating user');

    const { password, password2, name, email } = req.body;

    if (password !== password2) {
      return res.status(500).send('{errors: "Passwords don\'t match"}').end();
    }

    try {
      const user = await User.findOne({ email });

      await (user as any).updateUser({
        name,
        email,
        password,
      });

      return res.send(user);
    } catch (error) {
      next(error);
    }
  }

  @Post()
  private async createUser(req: Request, res: Response, next: NextFunction) {
    Logger.Info('Creating new user');

    const { password, password2, name, email } = req.body;

    if (password !== password2) {
      return res.status(500).send('{errors: "Passwords don\'t match"}').end();
    }

    try {
      const user = await (User as any).createUser({
        password,
        name,
        email,
      });

      return res.send(user);
    } catch (error) {
      next(error);
    }
  }

  @Delete()
  private async delUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.deleteOne({
        _id: req.body.id,
      });

      return res.send(user);
    } catch (error) {
      next(error);
    }
  }
}

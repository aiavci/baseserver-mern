/*
 * Copyright (c) 2019 Ali I. Avci
 */

import * as bodyParser from 'body-parser';
import * as controllers from './controllers';

import '../env/loadEnv';

import { connectDb } from './models';

import { User } from './models/user';

import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

import session from 'express-session';
import passport from 'passport';

import uuid from 'uuid/v4';

import cookieParser from 'cookie-parser';

import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;

class BaseServer extends Server {

  private readonly SERVER_STARTED = 'Base server started on port: ';

  constructor() {
    super(true);

    this.app.use(cookieParser());

    this.app.use(bodyParser.json());

    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(bodyParser.urlencoded({ extended: false }));

    // Express Session
    this.app.use(session({
      genid: (req) => {
        return uuid(); // use UUIDs for session IDs
      },
      secret: 'sample-secret',
      saveUninitialized: true,
      resave: true,
    }));

    // Init passport authentication
    this.app.use(passport.initialize());

    // persistent login sessions
    this.app.use(passport.session());

    /**
     * Sign in using Email and Password.
     */
    passport.use(new LocalStrategy(
      (username, password, done) => {
        User.findOne({ email: username.toLowerCase() }, (err: any, user: any) => {
          if (err) { return done(err); }
          if (!user) {
            return done(undefined, false, { message: `Email ${username} not found.` });
          }
          user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) { return done(err); }

            if (isMatch) {
              return done(undefined, user);
            }

            return done(undefined, false, { message: 'Invalid email or password.' });
          });
        });
      }));

    // Passport init
    passport.serializeUser<any, any>((user, done) => {
      done(undefined, user.id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id, (err: any, user: any) => {
        done(err, user);
      });
    });

    this.setupControllers();
  }

  private setupControllers(): void {
    const controllerInstances = [];

    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        const controller = (controllers as any)[name];
        controllerInstances.push(new controller());
      }
    }
    super.addControllers(controllerInstances);
  }

  public start(port: number): void {
    this.app.get('*', (req, res) => {
      res.send(this.SERVER_STARTED + port);
    });

    connectDb().then(async () => {
      this.app.listen(port, () => {
        Logger.Imp(this.SERVER_STARTED + port);
      });
    });
  }
}

export default BaseServer;

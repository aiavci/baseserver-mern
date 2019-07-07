import _ from 'lodash';
import passport from 'passport';
import passportLocal from 'passport-local';

// import { User, UserType } from '../models/User';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';

const LocalStrategy = passportLocal.Strategy;

// passport.serializeUser<any, any>((user, done) => {
//   done(undefined, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err: any, user: any) => {
//     done(err, user);
//   });
// });

// /**
//  * Sign in using Email and Password.
//  */
// passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//   User.findOne({ email: email.toLowerCase() }, (err: any, user: any) => {
//     if (err) { return done(err); }
//     if (!user) {
//       return done(undefined, false, { message: `Email ${email} not found.` });
//     }
//     user.comparePassword(password, (err: Error, isMatch: boolean) => {
//       if (err) { return done(err); }
//       if (isMatch) {
//         return done(undefined, user);
//       }
//       return done(undefined, false, { message: 'Invalid email or password.' });
//     });
//   });
// }));

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

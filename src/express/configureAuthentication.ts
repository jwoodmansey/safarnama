import * as passport from 'passport';
import { environment } from '../config/env';
import { UserRepo } from '../model/repo/UserRepo';
import { User } from '../model/schema/User';

export function configureAuthentication() {
  // tslint:disable-next-line:variable-name
  const FacebookStrategy = require('passport-facebook').Strategy;
  // tslint:disable-next-line:variable-name
  const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

  // Configure the Facebook strategy for use by Passport.
  //
  // OAuth 2.0-based strategies require a `verify` function which receives the
  // credential (`accessToken`) for accessing the Facebook API on the user's
  // behalf, along with the user's profile.  The function must invoke `cb`
  // with a user object, which will be set at `req.user` in route handlers after
  // authentication.
  passport.use(new FacebookStrategy(
    {
      clientID: environment.auth.facebook.clientID,
      clientSecret: environment.auth.facebook.clientSecret,
      callbackURL: '/api/auth/facebook/callback',
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      User.findOne(
        { facebookId: profile.id },
        (err: any, user: any) => {
          if (err) {
            console.log('findOne error', err);
            done(err, undefined);
          }
          const userRepo = new UserRepo();
          if (!user) {
            const newUser = userRepo.createUserFromProfile(profile, accessToken, refreshToken);
            console.log('New user, going to create entry in mongo...', profile);
            new User(newUser).save({}, (saveError: any) => {
              if (saveError) {
                console.log('newUser', saveError);
                done(saveError, undefined);
              }
              done(undefined, newUser);
            });
          } else {
            done(undefined, user);
          }
        },
      );
    },
  ));

  passport.use(new GoogleStrategy(
    {
      clientID: environment.auth.google.clientID,
      clientSecret: environment.auth.google.clientSecret,
      callbackURL: '/api/auth/google/callback',
    },

    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      // const repo = new UserRepo()
      User.findOne(
        { googleId: profile.id },
        (_err: any, user: any) => {
          console.log('Google User.findOne', profile);
          const userRepo = new UserRepo();
          if (!user) {
            const newUser = userRepo.createUserFromProfile(profile, accessToken, refreshToken);
            console.log('New user, going to create entry in mongo...', newUser);
            new User(newUser).save({}, (_: any, savedUser: any) => {
              done(undefined, savedUser);
            });
          } else {
            console.log('Existing user will return', user);
            done(undefined, user);
          }
        },
      );
    },
  ));

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  In a
  // production-quality application, this would typically be as simple as
  // supplying the user ID when serializing, and querying the user record by ID
  // from the database when deserializing.  However, due to the fact that this
  // example does not have a database, the complete Facebook profile is serialized
  // and deserialized.
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj as any);
  });
}

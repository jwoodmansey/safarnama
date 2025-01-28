import * as passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import { environment } from '../config/env';
import { UserRepo } from '../model/repo/UserRepo';
import { User } from '../model/schema/User';

export function configureAuthentication() {
  passport.use(new GoogleStrategy({
    clientID: environment.auth.google.clientID,
    clientSecret: environment.auth.google.clientSecret,
    callbackURL: '/api/auth/google/callback',
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const userRepo = new UserRepo();
      const user = await User.findOne({ googleId: profile.id });
      if (!user) {
        const newUser = userRepo.createUserFromProfile(profile, accessToken, refreshToken);
        const savedUser = await new User(newUser).save();
        done(null, savedUser);
      } else {
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }));

  passport.use(new FacebookStrategy({
    clientID: environment.auth.facebook.clientID,
    clientSecret: environment.auth.facebook.clientSecret,
    callbackURL: '/api/auth/facebook/callback',
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const userRepo = new UserRepo();
      const user = await User.findOne({ facebookId: profile.id });
      if (!user) {
        const newUser = userRepo.createUserFromProfile(profile, accessToken, refreshToken);
        const savedUser = await new User(newUser).save();
        done(null, savedUser);
      } else {
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj as any);
  });
}

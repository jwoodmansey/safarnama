import { Router } from 'express';
import * as passport from 'passport';
import { environment } from '../config/env';

export class AuthenticationRouter {
  private router: Router = Router();

  getRouter(): Router {
    this.router.get('/logout', (req, res) => {
      // fixme types are outdated
      (req as any).logout({ keepSessionInfo: false }, (done: any) => {
        const a = req as any;
        // this might not be needed anymore with
        // https://medium.com/passportjs/fixing-session-fixation-b2b68619c51d
        a.session.destroy((_err: any) => {
          console.error(_err);
          req.user = undefined;
          res.clearCookie('connect.sid');
          res.redirect('/');
          done();
        });
      });
    });

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    this.router.get(
      '/google',
      passport.authenticate('google', {
        scope: ['openid', 'profile', 'email'],
      }),
    );

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.

    // const sslConfig: any = (environment as any).ssl

    this.router.get(
      '/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      (_req, res) => {
        res.redirect(environment.baseUrl);
      },
    );

    this.router.get(
      '/facebook',
      passport.authenticate('facebook'),
    );

    this.router.get(
      '/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      (_req, res) => {
        // redirect back to angular app, which will now let the user in
        res.redirect(environment.baseUrl);
      },
    );

    return this.router;
  }
}

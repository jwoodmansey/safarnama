/* eslint-disable consistent-return */
import {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import * as passport from 'passport';

import { environment } from '../config/env';

export class AuthenticationRouter {
  private router: Router = Router();

  getRouter(): Router {
    // Error handling middleware
    const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };

    // Logout Route
    this.router.get(
      '/logout',
      asyncHandler(async (req: Request, res: Response) => {
        // req.logout({ keepSessionInfo: false }, (err: Error) => {
        // if (err) return res.status(500).json({ message: 'Logout failed' });

        const sessionReq = req as any;
        sessionReq.session.destroy((destroyErr: Error) => {
          if (destroyErr) {
            console.error(destroyErr);
            return res
              .status(500)
              .json({ message: 'Session destruction failed' });
          }

          // After successfully destroying the session, clear cookies and respond
          res.clearCookie('connect.sid');
          return res.status(200).json({ message: 'Successfully logged out' });
        });
        // return res.status(200).json({ message: 'Logged out but no session to destroy' });
        // });
      }),
    );

    // Google Auth Route
    this.router.get(
      '/google',
      passport.authenticate('google', {
        scope: ['openid', 'profile', 'email'],
      }),
    );

    // Google Callback Route with error handling
    this.router.get(
      '/google/callback',
      passport.authenticate('google', { failureRedirect: '/' }),
      asyncHandler((_req: Request, res: Response) => {
        console.log('Google callback successful');
        res.redirect(environment.baseUrl);
      }),
    );

    this.router.get('/check-session', (req, res) => {
      if (req.isAuthenticated()) {
        return res.json({ isAuthenticated: true });
      }
      return res.json({ isAuthenticated: false });
    });

    // Facebook Auth Route
    this.router.get('/facebook', passport.authenticate('facebook'));

    // Facebook Callback Route with error handling
    this.router.get(
      '/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      asyncHandler((_req: Request, res: Response) => {
        console.log('Facebook callback successful');
        res.redirect(environment.baseUrl);
      }),
    );

    return this.router;
  }
}

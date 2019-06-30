import { Router } from 'express'
import * as passport from 'passport'
import { environment } from '../config/env'

export class AuthenticationRouter {

  private router: Router = Router()

  getRouter(): Router {

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    this.router.get(
      '/google',
      passport.authenticate('google', {
        scope: ['openid', 'profile', 'email'],
      }))

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    this.router.get(
      '/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      (req, res) => {
        res.redirect(`https://${req.headers['host']}`)
      })

    this.router.get(
      '/facebook',
      passport.authenticate('facebook'))

    this.router.get(
      '/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      (req, res) => {
          // redirect back to angular app, which will now let the user in
        res.redirect(`https://${req.headers['host']}`)
      })

    return this.router
  }
}

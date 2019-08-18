import { Router } from 'express'
// @ts-ignore
import { ensureAuthenticated } from 'connect-ensure-authenticated'
import { getAllUsers, getAllPublishedExperiences } from '../controllers/AdminController'

export class AdminRouter {

  private router: Router = Router()

  getRouter(): Router {

    /**
     * Get all users
     */
    this.router.get('/users', ensureAuthenticated(), getAllUsers)

    this.router.get('/published-experiences', ensureAuthenticated(), getAllPublishedExperiences)

    return this.router
  }
}

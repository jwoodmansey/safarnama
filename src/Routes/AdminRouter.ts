import { Router } from 'express'
// @ts-ignore
import { ensureAuthenticated } from 'connect-ensure-authenticated'
import {
  getAllUsers, getAllPublishedExperiences, featureExperience, ensureAdmin, unFeatureExperience,
} from '../controllers/AdminController'

export class AdminRouter {

  private router: Router = Router()

  getRouter(): Router {

    /**
     * Get all users
     */
    this.router.get(
      '/users',
      ensureAdmin,
      getAllUsers,
    )

    this.router.get(
      '/published-experiences',
      ensureAdmin,
      getAllPublishedExperiences,
    )

    this.router.post(
      '/published-experiences/:id/feature',
      ensureAdmin,
      featureExperience,
    )

    this.router.delete(
      '/published-experiences/:id/feature',
      ensureAdmin,
      unFeatureExperience,
    )

    return this.router
  }
}

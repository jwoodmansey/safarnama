import { Router } from 'express'
import { ensureAdmin, ensureAdminOfProjectForExperience, featureExperience, getAllPublishedExperiences, getAllUsers, unFeatureExperience } from '../controllers/AdminController'

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
      ensureAdminOfProjectForExperience,
      featureExperience,
    )

    this.router.delete(
      '/published-experiences/:id/feature',
      ensureAdminOfProjectForExperience,
      unFeatureExperience,
    )

    return this.router
  }
}

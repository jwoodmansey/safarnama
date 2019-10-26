import { Router } from 'express'
import {
  getAllMyExperienceData,
  getAllFeaturedExperiences,
} from '../controllers/ExperiencesController'
// @ts-ignore
import { ensureAuthenticated } from 'connect-ensure-authenticated'
export class ExperiencesRouter {

  private router: Router = Router()

  getRouter(): Router {

    /**
     * Returns all the experience data for the currently authenticated user
     * This will also include their Places, Media, and Routes
     */
    this.router.get('/mine', ensureAuthenticated(), getAllMyExperienceData)

    /**
     * Returns a list of experience snapshots,
     * where the experience has been set as featured
     */
    this.router.get('/featured', getAllFeaturedExperiences)

    return this.router
  }
}

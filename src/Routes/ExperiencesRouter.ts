import { Router } from 'express'
import { getAllMyExperienceData } from '../controllers/ExperiencesController'
export class ExperiencesRouter {

  private router: Router = Router()

  getRouter(): Router {

    /**
     * Returns all the experience data for the currently authenticated user
     * This will also include their Places, Media, and Routes
     */
    this.router.get('mine', getAllMyExperienceData)

    return this.router
  }
}

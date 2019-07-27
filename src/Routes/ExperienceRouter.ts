import { Router } from 'express'
// @ts-ignore
import { ensureAuthenticated } from 'connect-ensure-authenticated'
import {
  createExperience,
  editExperience, getExperienceSnapshot, publishExperienceSnapshot,
} from '../controllers/ExperienceController'

export class ExperienceRouter {

  private router: Router = Router()

  getRouter(): Router {

    /**
     * Create a new experience
     */
    this.router.post('', ensureAuthenticated(), createExperience)

    /**
     * Edit an existing experience
     */
    this.router.put('/:experienceId', ensureAuthenticated(), editExperience)

    /**
     * Publishes an experience, this will generate a 'snapshot' of the current state
     * of the experience
     */
    this.router.post('/:experienceId/publish', ensureAuthenticated(), publishExperienceSnapshot)

    /**
     * Gets the last published experience snapshot
     */
    this.router.get('/:experienceId/snapshot', getExperienceSnapshot)

    return this.router
  }
}

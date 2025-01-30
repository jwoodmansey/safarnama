// @ts-ignore
import { ensureAuthenticated } from 'connect-ensure-authenticated';
import { Router } from 'express';

import {
  addCollaboratorsToExperience,
  cloneExperience,
  createExperience,
  editExperience,
  exportExperienceData,
  getCollaboratorsForExperience,
  getExperienceSnapshot,
  publishExperienceSnapshot,
  removeCollaboratorFromExperience,
  unpublishExperience,
} from '../controllers/ExperienceController';

export class ExperienceRouter {
  private router: Router = Router();

  getRouter(): Router {
    /**
     * Create a new experience
     */
    this.router.post('', ensureAuthenticated(), createExperience);

    /**
     * Edit an existing experience
     */
    this.router.put('/:experienceId', ensureAuthenticated(), editExperience);

    /**
     * Publishes an experience, this will generate a 'snapshot' of the current state
     * of the experience
     */
    this.router.post('/:experienceId/publish', ensureAuthenticated(), publishExperienceSnapshot);

    /**
     * Clones an experience, copying all places, routes etc
     */
    this.router.post(
      '/:experienceId/clone',
      ensureAuthenticated(),
      cloneExperience,
    );

    /**
     * Allow a user to collaborate on this experience
     */
    this.router.post(
      '/:experienceId/collaborator',
      ensureAuthenticated(),
      addCollaboratorsToExperience,
    );
    this.router.delete(
      '/:experienceId/collaborator/:userId',
      ensureAuthenticated(),
      removeCollaboratorFromExperience,
    );
    this.router.get(
      '/:experienceId/collaborator',
      ensureAuthenticated(),
      getCollaboratorsForExperience,
    );

    /**
     * Unpublished an experience, this will delete all public snapshots of this experience
     */
    this.router.post('/:experienceId/unpublish', ensureAuthenticated(), unpublishExperience);

    /**
     * Gets the last published experience snapshot
     */
    this.router.get('/:experienceId/snapshot', getExperienceSnapshot);

    this.router.get('/:experienceId/export', ensureAuthenticated(), exportExperienceData);

    return this.router;
  }
}

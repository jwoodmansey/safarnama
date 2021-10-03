import { Router } from 'express'
import { ensureAdminOfProjectForExperience } from '../controllers/AdminController'
import { getAllMyProjects, getById, editById, removeRole, setRole } from '../controllers/ProjectController'

/**
 * Place types are a way of categorising Places
 */
export class ProjectRouter {

  private router: Router = Router()

  getRouter(): Router {

    /**
     * Returns all the Projects which I have access to
     */
    this.router.get('/mine', getAllMyProjects)

    this.router.get('/:id', ensureAdminOfProjectForExperience, getById)

    this.router.put('/:id', ensureAdminOfProjectForExperience, editById)

    this.router.put('/:id/member/:userId/:role', ensureAdminOfProjectForExperience, setRole)

    this.router.delete('/:id/member/:userId/:role', ensureAdminOfProjectForExperience, removeRole)

    return this.router
  }
}

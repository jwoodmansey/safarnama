import { Router } from 'express'
import { getAllMyProjects, getById, removeRole, setRole } from '../controllers/ProjectController'

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

    this.router.get('/:id', getById)
    
    this.router.put('/:id/member/:userId/:role', setRole)

    this.router.delete('/:id/member/:userId/:role', removeRole)

    return this.router
  }
}

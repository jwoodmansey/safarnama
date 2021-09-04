import { Router } from 'express'
import { getAllMyProjects } from '../controllers/ProjectController'

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

    return this.router
  }
}

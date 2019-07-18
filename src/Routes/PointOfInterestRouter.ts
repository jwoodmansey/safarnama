import { Router } from 'express'
import { createPlace, deletePlace, editPlace } from '../controllers/PlaceController'

export class PointOfInterestRouter {

  private router: Router = Router()

  getRouter(): Router {
    this.router.post('', createPlace)
    this.router.put('/:poiId', editPlace)
    this.router.delete('/:poiId', deletePlace)
    return this.router
  }
}

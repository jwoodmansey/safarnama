import { Router } from 'express';
import { createPlaceType, getAllMyPlaceTypes, deletePlaceType } from '../controllers/PlaceTypeController';

/**
 * Place types are a way of categorising Places
 */
export class PlaceTypeRouter {
  private router: Router = Router();

  getRouter(): Router {
    /**
     * Create a new PlaceType
     */
    this.router.post('', createPlaceType);

    /**
     * Returns all the PlaceTypes for the currently authenticated user
     */
    this.router.get('/mine', getAllMyPlaceTypes);

    this.router.delete('/:id', deletePlaceType);

    return this.router;
  }
}

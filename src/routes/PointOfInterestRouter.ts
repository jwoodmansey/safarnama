import { Router } from 'express';

import {
  createPlace,
  deletePlace,
  editPlace,
  getPlaces,
} from '../controllers/PlaceController';

export class PointOfInterestRouter {
  private router: Router = Router();

  getRouter(): Router {
    this.router.post('', createPlace);
    this.router.get('', getPlaces);
    this.router.put('/:poiId', editPlace);
    this.router.delete('/:poiId', deletePlace);
    return this.router;
  }
}

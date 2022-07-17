import { Router } from 'express';
import { editProfile, getMyProfile } from '../controllers/UserController';

export class UserRouter {
  private router: Router = Router();

  getRouter(): Router {
    this.router.get('', getMyProfile);

    /**
    * Allows setting of media metadata, OR entire replacement of a media file
    */
    this.router.put('/:userId', editProfile);

    return this.router;
  }
}

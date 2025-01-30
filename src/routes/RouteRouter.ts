import { Router } from 'express';

import {
  createRoute,
  deleteRoute,
  editRoute,
  getAllRoutes,
} from '../controllers/RouteController';

/**
 * import { check, validationResult } from 'express-validator/check'
 *       '',
      [
        // TODO validation
        check('name').isString().isLength({ max: 32 }).escape().trim(),
        check('colour').isString().isLength({ max: 32 }).escape().trim(),
        // check('name').isString().isLength({ max: 32 }),
      ],
      async (request: Request, response: Response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
          return response.status(422).json({ errors: errors.array() })
        }
                  const errors = validationResult(request)
          if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() })
          }
 */

export class RouteRouter {
  private router: Router = Router();

  getRouter(): Router {
    this.router.post('', createRoute);
    this.router.get('', getAllRoutes);
    this.router.put('/:routeId', editRoute);
    this.router.delete('/:routeId', deleteRoute);
    return this.router;
  }
}

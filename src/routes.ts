import { Router } from 'express';

import { AdminRouter } from './routes/AdminRouter';
import { AuthenticationRouter } from './routes/AuthenticationRouter';
import { ExperienceRouter } from './routes/ExperienceRouter';
import { ExperiencesRouter } from './routes/ExperiencesRouter';
import { MediaRouter } from './routes/MediaRouter';
import { PlaceTypeRouter } from './routes/PlaceTypeRouter';
import { PointOfInterestRouter } from './routes/PointOfInterestRouter';
import { ProjectRouter } from './routes/ProjectRouter';
import { RouteRouter } from './routes/RouteRouter';
import { UserRouter } from './routes/UserRouter';

const { ensureAuthenticated } = require('connect-ensure-authenticated');

const router = Router();

// Define route mappings
router.use('/api/auth/', new AuthenticationRouter().getRouter());
router.use('/api/experience', new ExperienceRouter().getRouter());
router.use('/api/experiences', new ExperiencesRouter().getRouter());
router.use(
  '/api/point-of-interest',
  ensureAuthenticated(),
  new PointOfInterestRouter().getRouter(),
);
router.use('/api/route', ensureAuthenticated(), new RouteRouter().getRouter());
router.use('/api/user', ensureAuthenticated(), new UserRouter().getRouter());
router.use('/api/media', ensureAuthenticated(), new MediaRouter().getRouter());
router.use('/api/admin', ensureAuthenticated(), new AdminRouter().getRouter());
router.use(
  '/api/place-types',
  ensureAuthenticated(),
  new PlaceTypeRouter().getRouter(),
);
router.use(
  '/api/project',
  ensureAuthenticated(),
  new ProjectRouter().getRouter(),
);

export default router;

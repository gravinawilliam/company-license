import { Router } from 'express';

import companies from './companies.route';
import healthCheck from './health-check.route';
import licenses from './licenses.route';

const routes: Router = Router();

routes.use('/health-check', healthCheck);
routes.use('/', companies);
routes.use('/', licenses);

export default routes;

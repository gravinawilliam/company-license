import { Router } from 'express';

import { makeCreateLicenseController } from '@factories/controllers/licenses/create-license-controller.factory';
import { makeDeleteLicenseController } from '@factories/controllers/licenses/delete-license-controller.factory';
import { makeGetLicenseController } from '@factories/controllers/licenses/get-license-controller.factory';
import { makeListLicensesController } from '@factories/controllers/licenses/list-licenses-controller.factory';
import { makeUpdateLicenseController } from '@factories/controllers/licenses/update-license-controller.factory';

import { adapterRoute } from '@main/frameworks/express/adapters/express-router.adapter';

const router: Router = Router();

router.get('/licencas', adapterRoute(makeListLicensesController()));

router.get('/licenca/:id', adapterRoute(makeGetLicenseController()));

router.post('/licenca/insert', adapterRoute(makeCreateLicenseController()));

router.put('/licenca/update/:id', adapterRoute(makeUpdateLicenseController()));

router.delete('/licenca/delete/:id', adapterRoute(makeDeleteLicenseController()));

export default router;

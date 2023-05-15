import { Router } from 'express';

import { makeCreateCompanyController } from '@factories/controllers/companies/create-company-controller.factory';
import { makeDeleteCompanyController } from '@factories/controllers/companies/delete-company-controller.factory';
import { makeGetCompanyController } from '@factories/controllers/companies/get-company-controller.factory';
import { makeListCompaniesController } from '@factories/controllers/companies/list-companies-controller.factory';
import { makeUpdateCompanyController } from '@factories/controllers/companies/update-company-controller.factory';

import { adapterRoute } from '@main/frameworks/express/adapters/express-router.adapter';

const router: Router = Router();

router.get('/empresas', adapterRoute(makeListCompaniesController()));

router.get('/empresa/:id', adapterRoute(makeGetCompanyController()));

router.post('/empresa/insert', adapterRoute(makeCreateCompanyController()));

router.put('/empresa/update/:id', adapterRoute(makeUpdateCompanyController()));

router.delete('/empresa/delete/:id', adapterRoute(makeDeleteCompanyController()));

export default router;

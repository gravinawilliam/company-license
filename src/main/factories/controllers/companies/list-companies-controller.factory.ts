import { ListCompaniesController, ListCompaniesControllerDTO } from '@controllers/companies/list-companies.controller';

import { Controller } from '@application/controllers/_shared/controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeVerifyPrivateKeyUseCase } from '@factories/use-cases/authentication/verify-private-key-use-case.factory';
import { makeListCompaniesUseCase } from '@factories/use-cases/companies/list-companies-use-case.factory';

export const makeListCompaniesController = (): Controller<
  ListCompaniesControllerDTO.Parameters,
  ListCompaniesControllerDTO.Result
> => new ListCompaniesController(makeLoggerProvider(), makeVerifyPrivateKeyUseCase(), makeListCompaniesUseCase());

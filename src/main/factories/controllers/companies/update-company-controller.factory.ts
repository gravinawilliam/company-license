import { UpdateCompanyController, UpdateCompanyControllerDTO } from '@controllers/companies/update-company.controller';

import { Controller } from '@application/controllers/_shared/controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeVerifyPrivateKeyUseCase } from '@factories/use-cases/authentication/verify-private-key-use-case.factory';
import { makeUpdateCompanyUseCase } from '@factories/use-cases/companies/update-company-use-case.factory';

export const makeUpdateCompanyController = (): Controller<
  UpdateCompanyControllerDTO.Parameters,
  UpdateCompanyControllerDTO.Result
> => new UpdateCompanyController(makeLoggerProvider(), makeVerifyPrivateKeyUseCase(), makeUpdateCompanyUseCase());

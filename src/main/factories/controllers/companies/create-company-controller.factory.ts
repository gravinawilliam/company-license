import { Controller } from '@application/controllers/_shared/controller';
import {
  CreateCompanyController,
  CreateCompanyControllerDTO
} from '@application/controllers/companies/create-company.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeVerifyPrivateKeyUseCase } from '@factories/use-cases/authentication/verify-private-key-use-case.factory';
import { makeCreateCompanyUseCase } from '@factories/use-cases/companies/create-company-use-case.factory';

export const makeCreateCompanyController = (): Controller<
  CreateCompanyControllerDTO.Parameters,
  CreateCompanyControllerDTO.Result
> => new CreateCompanyController(makeLoggerProvider(), makeVerifyPrivateKeyUseCase(), makeCreateCompanyUseCase());

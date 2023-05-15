import { Controller } from '@application/controllers/_shared/controller';
import {
  DeleteCompanyController,
  DeleteCompanyControllerDTO
} from '@application/controllers/companies/delete-company.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeVerifyPrivateKeyUseCase } from '@factories/use-cases/authentication/verify-private-key-use-case.factory';
import { makeDeleteCompanyUseCase } from '@factories/use-cases/companies/delete-company-use-case.factory';

export const makeDeleteCompanyController = (): Controller<
  DeleteCompanyControllerDTO.Parameters,
  DeleteCompanyControllerDTO.Result
> => new DeleteCompanyController(makeLoggerProvider(), makeVerifyPrivateKeyUseCase(), makeDeleteCompanyUseCase());

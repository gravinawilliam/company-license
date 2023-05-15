import { GetCompanyController, GetCompanyControllerDTO } from '@controllers/companies/get-company.controller';

import { Controller } from '@application/controllers/_shared/controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeVerifyPrivateKeyUseCase } from '@factories/use-cases/authentication/verify-private-key-use-case.factory';
import { makeGetCompanyUseCase } from '@factories/use-cases/companies/get-company-use-case.factory';

export const makeGetCompanyController = (): Controller<
  GetCompanyControllerDTO.Parameters,
  GetCompanyControllerDTO.Result
> => new GetCompanyController(makeLoggerProvider(), makeVerifyPrivateKeyUseCase(), makeGetCompanyUseCase());

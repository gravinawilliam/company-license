import { UseCase } from '@use-cases/_shared/use-case';
import { CreateCompanyUseCase, CreateCompanyUseCaseDTO } from '@use-cases/companies/create-company.use-case';

import { makeAddressProvider } from '@factories/providers/address-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCompaniesRepository } from '@factories/repositories/companies-repository.factory';

export const makeCreateCompanyUseCase = (): UseCase<
  CreateCompanyUseCaseDTO.Parameters,
  CreateCompanyUseCaseDTO.ResultFailure,
  CreateCompanyUseCaseDTO.ResultSuccess
> => new CreateCompanyUseCase(makeLoggerProvider(), makeAddressProvider(), makeCompaniesRepository());

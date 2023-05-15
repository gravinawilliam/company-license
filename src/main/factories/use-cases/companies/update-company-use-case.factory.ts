import { UseCase } from '@use-cases/_shared/use-case';
import { UpdateCompanyUseCase, UpdateCompanyUseCaseDTO } from '@use-cases/companies/update-company.use-case';

import { makeAddressProvider } from '@factories/providers/address-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCompaniesRepository } from '@factories/repositories/companies-repository.factory';

export const makeUpdateCompanyUseCase = (): UseCase<
  UpdateCompanyUseCaseDTO.Parameters,
  UpdateCompanyUseCaseDTO.ResultFailure,
  UpdateCompanyUseCaseDTO.ResultSuccess
> => new UpdateCompanyUseCase(makeLoggerProvider(), makeCompaniesRepository(), makeAddressProvider());

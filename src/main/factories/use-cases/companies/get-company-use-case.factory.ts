import { UseCase } from '@use-cases/_shared/use-case';
import { GetCompanyUseCase, GetCompanyUseCaseDTO } from '@use-cases/companies/get-company.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCompaniesRepository } from '@factories/repositories/companies-repository.factory';

export const makeGetCompanyUseCase = (): UseCase<
  GetCompanyUseCaseDTO.Parameters,
  GetCompanyUseCaseDTO.ResultFailure,
  GetCompanyUseCaseDTO.ResultSuccess
> => new GetCompanyUseCase(makeLoggerProvider(), makeCompaniesRepository());

import { UseCase } from '@use-cases/_shared/use-case';
import { ListCompaniesUseCase, ListCompaniesUseCaseDTO } from '@use-cases/companies/list-companies.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCompaniesRepository } from '@factories/repositories/companies-repository.factory';

export const makeListCompaniesUseCase = (): UseCase<
  ListCompaniesUseCaseDTO.Parameters,
  ListCompaniesUseCaseDTO.ResultFailure,
  ListCompaniesUseCaseDTO.ResultSuccess
> => new ListCompaniesUseCase(makeLoggerProvider(), makeCompaniesRepository());

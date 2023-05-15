import { UseCase } from '@use-cases/_shared/use-case';
import { DeleteCompanyUseCase, DeleteCompanyUseCaseDTO } from '@use-cases/companies/delete-company.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCompaniesRepository } from '@factories/repositories/companies-repository.factory';

export const makeDeleteCompanyUseCase = (): UseCase<
  DeleteCompanyUseCaseDTO.Parameters,
  DeleteCompanyUseCaseDTO.ResultFailure,
  DeleteCompanyUseCaseDTO.ResultSuccess
> => new DeleteCompanyUseCase(makeLoggerProvider(), makeCompaniesRepository());

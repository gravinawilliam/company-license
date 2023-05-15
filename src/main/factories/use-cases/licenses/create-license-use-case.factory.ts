import { UseCase } from '@use-cases/_shared/use-case';
import { CreateLicenseUseCase, CreateLicenseUseCaseDTO } from '@use-cases/licenses/create-license.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCompaniesRepository } from '@factories/repositories/companies-repository.factory';
import { makeLicensesRepository } from '@factories/repositories/licenses-repository.factory';

export const makeCreateLicenseUseCase = (): UseCase<
  CreateLicenseUseCaseDTO.Parameters,
  CreateLicenseUseCaseDTO.ResultFailure,
  CreateLicenseUseCaseDTO.ResultSuccess
> => new CreateLicenseUseCase(makeLoggerProvider(), makeCompaniesRepository(), makeLicensesRepository());

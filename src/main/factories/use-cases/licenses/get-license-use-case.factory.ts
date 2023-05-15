import { UseCase } from '@use-cases/_shared/use-case';
import { GetLicenseUseCase, GetLicenseUseCaseDTO } from '@use-cases/licenses/get-license.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeLicensesRepository } from '@factories/repositories/licenses-repository.factory';

export const makeGetLicenseUseCase = (): UseCase<
  GetLicenseUseCaseDTO.Parameters,
  GetLicenseUseCaseDTO.ResultFailure,
  GetLicenseUseCaseDTO.ResultSuccess
> => new GetLicenseUseCase(makeLoggerProvider(), makeLicensesRepository());

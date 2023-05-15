import { UseCase } from '@use-cases/_shared/use-case';
import { UpdateLicenseUseCase, UpdateLicenseUseCaseDTO } from '@use-cases/licenses/update-license.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeLicensesRepository } from '@factories/repositories/licenses-repository.factory';

export const makeUpdateLicenseUseCase = (): UseCase<
  UpdateLicenseUseCaseDTO.Parameters,
  UpdateLicenseUseCaseDTO.ResultFailure,
  UpdateLicenseUseCaseDTO.ResultSuccess
> => new UpdateLicenseUseCase(makeLoggerProvider(), makeLicensesRepository());

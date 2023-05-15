import { UseCase } from '@use-cases/_shared/use-case';
import { DeleteLicenseUseCase, DeleteLicenseUseCaseDTO } from '@use-cases/licenses/delete-license.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeLicensesRepository } from '@factories/repositories/licenses-repository.factory';

export const makeDeleteLicenseUseCase = (): UseCase<
  DeleteLicenseUseCaseDTO.Parameters,
  DeleteLicenseUseCaseDTO.ResultFailure,
  DeleteLicenseUseCaseDTO.ResultSuccess
> => new DeleteLicenseUseCase(makeLoggerProvider(), makeLicensesRepository());

import { UseCase } from '@use-cases/_shared/use-case';
import { ListLicensesUseCase, ListLicensesUseCaseDTO } from '@use-cases/licenses/list-licenses.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeLicensesRepository } from '@factories/repositories/licenses-repository.factory';

export const makeListLicensesUseCase = (): UseCase<
  ListLicensesUseCaseDTO.Parameters,
  ListLicensesUseCaseDTO.ResultFailure,
  ListLicensesUseCaseDTO.ResultSuccess
> => new ListLicensesUseCase(makeLoggerProvider(), makeLicensesRepository());

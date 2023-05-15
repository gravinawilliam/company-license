import { ListLicensesControllerDTO, ListLicensesController } from '@controllers/licenses/list-licenses.controller';

import { Controller } from '@application/controllers/_shared/controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeVerifyPrivateKeyUseCase } from '@factories/use-cases/authentication/verify-private-key-use-case.factory';
import { makeListLicensesUseCase } from '@factories/use-cases/licenses/list-licenses-use-case.factory';

export const makeListLicensesController = (): Controller<
  ListLicensesControllerDTO.Parameters,
  ListLicensesControllerDTO.Result
> => new ListLicensesController(makeLoggerProvider(), makeVerifyPrivateKeyUseCase(), makeListLicensesUseCase());

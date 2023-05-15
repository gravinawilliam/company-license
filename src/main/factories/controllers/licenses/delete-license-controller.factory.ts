import { DeleteLicenseControllerDTO, DeleteLicenseController } from '@controllers/licenses/delete-license.controller';

import { Controller } from '@application/controllers/_shared/controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeVerifyPrivateKeyUseCase } from '@factories/use-cases/authentication/verify-private-key-use-case.factory';
import { makeDeleteLicenseUseCase } from '@factories/use-cases/licenses/delete-license-use-case.factory';

export const makeDeleteLicenseController = (): Controller<
  DeleteLicenseControllerDTO.Parameters,
  DeleteLicenseControllerDTO.Result
> => new DeleteLicenseController(makeLoggerProvider(), makeVerifyPrivateKeyUseCase(), makeDeleteLicenseUseCase());

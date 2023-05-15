import { UpdateLicenseControllerDTO, UpdateLicenseController } from '@controllers/licenses/update-license.controller';

import { Controller } from '@application/controllers/_shared/controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeVerifyPrivateKeyUseCase } from '@factories/use-cases/authentication/verify-private-key-use-case.factory';
import { makeUpdateLicenseUseCase } from '@factories/use-cases/licenses/update-license-use-case.factory';

export const makeUpdateLicenseController = (): Controller<
  UpdateLicenseControllerDTO.Parameters,
  UpdateLicenseControllerDTO.Result
> => new UpdateLicenseController(makeLoggerProvider(), makeVerifyPrivateKeyUseCase(), makeUpdateLicenseUseCase());

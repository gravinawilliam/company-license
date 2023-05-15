import { CreateLicenseController, CreateLicenseControllerDTO } from '@controllers/licenses/create-license.controller';

import { Controller } from '@application/controllers/_shared/controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeVerifyPrivateKeyUseCase } from '@factories/use-cases/authentication/verify-private-key-use-case.factory';
import { makeCreateLicenseUseCase } from '@factories/use-cases/licenses/create-license-use-case.factory';

export const makeCreateLicenseController = (): Controller<
  CreateLicenseControllerDTO.Parameters,
  CreateLicenseControllerDTO.Result
> => new CreateLicenseController(makeLoggerProvider(), makeVerifyPrivateKeyUseCase(), makeCreateLicenseUseCase());

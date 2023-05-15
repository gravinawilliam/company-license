import { GetLicenseController, GetLicenseControllerDTO } from '@controllers/licenses/get-license.controller';

import { Controller } from '@application/controllers/_shared/controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeVerifyPrivateKeyUseCase } from '@factories/use-cases/authentication/verify-private-key-use-case.factory';
import { makeGetLicenseUseCase } from '@factories/use-cases/licenses/get-license-use-case.factory';

export const makeGetLicenseController = (): Controller<
  GetLicenseControllerDTO.Parameters,
  GetLicenseControllerDTO.Result
> => new GetLicenseController(makeLoggerProvider(), makeVerifyPrivateKeyUseCase(), makeGetLicenseUseCase());

import { UseCase } from '@use-cases/_shared/use-case';
import {
  VerifyPrivateKeyUseCase,
  VerifyPrivateKeyUseCaseDTO
} from '@use-cases/authentication/verify-private-key.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeVerifyPrivateKeyUseCase = (): UseCase<
  VerifyPrivateKeyUseCaseDTO.Parameters,
  VerifyPrivateKeyUseCaseDTO.ResultFailure,
  VerifyPrivateKeyUseCaseDTO.ResultSuccess
> =>
  new VerifyPrivateKeyUseCase(makeLoggerProvider(), {
    privateKey: 'private-key-1'
  });

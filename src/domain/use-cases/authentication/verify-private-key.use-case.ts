import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';

import { InvalidPrivateKeyError } from '@errors/value-objects/private-key/invalid-private-key.error';

import { Either, failure, success } from '@shared/utils/either.util';

export class VerifyPrivateKeyUseCase extends UseCase<
  VerifyPrivateKeyUseCaseDTO.Parameters,
  VerifyPrivateKeyUseCaseDTO.ResultFailure,
  VerifyPrivateKeyUseCaseDTO.ResultSuccess
> {
  constructor(loggerProvider: ISendLogTimeUseCaseLoggerProvider, private readonly environments: { privateKey: string }) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: VerifyPrivateKeyUseCaseDTO.Parameters): VerifyPrivateKeyUseCaseDTO.Result {
    if (parameters.privateKey !== this.environments.privateKey) {
      return failure(new InvalidPrivateKeyError());
    }

    return success(undefined);
  }
}

export namespace VerifyPrivateKeyUseCaseDTO {
  export type Parameters = Readonly<{
    privateKey: string;
  }>;

  export type ResultFailure = Readonly<InvalidPrivateKeyError>;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import {
  VerifyPrivateKeyUseCase,
  VerifyPrivateKeyUseCaseDTO
} from '@use-cases/authentication/verify-private-key.use-case';

import { InvalidPrivateKeyError } from '@errors/value-objects/private-key/invalid-private-key.error';

describe('Verify private key USE CASE', () => {
  let sut: UseCase<
    VerifyPrivateKeyUseCaseDTO.Parameters,
    VerifyPrivateKeyUseCaseDTO.ResultFailure,
    VerifyPrivateKeyUseCaseDTO.ResultSuccess
  >;
  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;

  let correctParametersSut: VerifyPrivateKeyUseCaseDTO.Parameters;

  beforeAll(() => {
    loggerProvider = mock();
    loggerProvider.sendLogTimeUseCase.mockReturnValue();
  });

  beforeEach(() => {
    correctParametersSut = { privateKey: 'any_private_key' };

    sut = new VerifyPrivateKeyUseCase(loggerProvider, {
      privateKey: 'any_private_key'
    });
  });

  it('should return RepositoryError if private key no to equal', async () => {
    const error = new InvalidPrivateKeyError();

    const result = await sut.execute({
      privateKey: 'any_private_key_different'
    });

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should successfully verify private key', async () => {
    const responseSuccess: VerifyPrivateKeyUseCaseDTO.ResultSuccess = undefined;

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(responseSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
  });
});

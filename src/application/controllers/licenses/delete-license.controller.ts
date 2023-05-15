import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyPrivateKeyUseCaseDTO } from '@use-cases/authentication/verify-private-key.use-case';
import { DeleteLicenseUseCaseDTO } from '@use-cases/licenses/delete-license.use-case';

import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class DeleteLicenseController extends Controller<
  DeleteLicenseControllerDTO.Parameters,
  DeleteLicenseControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyPrivateKeyUseCase: UseCase<
      VerifyPrivateKeyUseCaseDTO.Parameters,
      VerifyPrivateKeyUseCaseDTO.ResultFailure,
      VerifyPrivateKeyUseCaseDTO.ResultSuccess
    >,
    private readonly deleteLicenseUseCase: UseCase<
      DeleteLicenseUseCaseDTO.Parameters,
      DeleteLicenseUseCaseDTO.ResultFailure,
      DeleteLicenseUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: DeleteLicenseControllerDTO.Parameters): DeleteLicenseControllerDTO.Result {
    const { params, headers } = parameters;

    const resultVerifyPrivateKey = await this.verifyPrivateKeyUseCase.execute({
      privateKey: headers['private-key']
    });
    if (resultVerifyPrivateKey.isFailure()) return failure(resultVerifyPrivateKey.value);

    const resultDelete = await this.deleteLicenseUseCase.execute({
      license: { id: params.id }
    });
    if (resultDelete.isFailure()) return failure(resultDelete.value);
    const { license } = resultDelete.value;

    return success({
      data: {
        deleted_license: {
          deleted_at: license.deletedAt.toISOString(),
          id: license.id
        }
      },
      status: StatusSuccess.DONE
    });
  }
}

export namespace DeleteLicenseControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      undefined,
      {
        ['private-key']: string;
      },
      {
        id: string;
      }
    >
  >;

  type ResultError = VerifyPrivateKeyUseCaseDTO.ResultFailure | DeleteLicenseUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      deleted_license: {
        id: string;
        deleted_at: string;
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

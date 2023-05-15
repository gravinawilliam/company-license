import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyPrivateKeyUseCaseDTO } from '@use-cases/authentication/verify-private-key.use-case';
import { DeleteCompanyUseCaseDTO } from '@use-cases/companies/delete-company.use-case';

import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class DeleteCompanyController extends Controller<
  DeleteCompanyControllerDTO.Parameters,
  DeleteCompanyControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyPrivateKeyUseCase: UseCase<
      VerifyPrivateKeyUseCaseDTO.Parameters,
      VerifyPrivateKeyUseCaseDTO.ResultFailure,
      VerifyPrivateKeyUseCaseDTO.ResultSuccess
    >,
    private readonly deleteCompanyUseCase: UseCase<
      DeleteCompanyUseCaseDTO.Parameters,
      DeleteCompanyUseCaseDTO.ResultFailure,
      DeleteCompanyUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: DeleteCompanyControllerDTO.Parameters): DeleteCompanyControllerDTO.Result {
    const { params, headers } = parameters;

    const resultVerifyPrivateKey = await this.verifyPrivateKeyUseCase.execute({
      privateKey: headers['private-key']
    });
    if (resultVerifyPrivateKey.isFailure()) return failure(resultVerifyPrivateKey.value);

    const resultDeleteCompany = await this.deleteCompanyUseCase.execute({
      company: { id: params.id }
    });
    if (resultDeleteCompany.isFailure()) return failure(resultDeleteCompany.value);
    const { company } = resultDeleteCompany.value;

    return success({
      data: {
        deletedCompany: {
          deleted_at: company.deletedAt.toISOString(),
          id: company.id
        }
      },
      status: StatusSuccess.DONE
    });
  }
}

export namespace DeleteCompanyControllerDTO {
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

  type ResultError = VerifyPrivateKeyUseCaseDTO.ResultFailure | DeleteCompanyUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      deletedCompany: {
        id: string;
        deleted_at: string;
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

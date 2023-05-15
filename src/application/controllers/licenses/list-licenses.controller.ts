import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyPrivateKeyUseCaseDTO } from '@use-cases/authentication/verify-private-key.use-case';
import { ListLicensesUseCaseDTO } from '@use-cases/licenses/list-licenses.use-case';

import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class ListLicensesController extends Controller<
  ListLicensesControllerDTO.Parameters,
  ListLicensesControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyPrivateKeyUseCase: UseCase<
      VerifyPrivateKeyUseCaseDTO.Parameters,
      VerifyPrivateKeyUseCaseDTO.ResultFailure,
      VerifyPrivateKeyUseCaseDTO.ResultSuccess
    >,
    private readonly listLicensesUseCase: UseCase<
      ListLicensesUseCaseDTO.Parameters,
      ListLicensesUseCaseDTO.ResultFailure,
      ListLicensesUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: ListLicensesControllerDTO.Parameters): ListLicensesControllerDTO.Result {
    const { headers } = parameters;

    const resultVerifyPrivateKey = await this.verifyPrivateKeyUseCase.execute({
      privateKey: headers['private-key']
    });
    if (resultVerifyPrivateKey.isFailure()) return failure(resultVerifyPrivateKey.value);

    const resultGetLicense = await this.listLicensesUseCase.execute(undefined);
    if (resultGetLicense.isFailure()) return failure(resultGetLicense.value);
    const { licenses } = resultGetLicense.value;

    return success({
      data: {
        licenses: licenses.map(license => ({
          id: license.id,
          license_number: license.licenseNumber,
          environmental_agency: license.environmentalAgency,
          emission_date: license.emissionDate.toISOString(),
          expiration_date: license.expirationDate.toISOString()
        }))
      },
      status: StatusSuccess.DONE
    });
  }
}

export namespace ListLicensesControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      undefined,
      {
        ['private-key']: string;
      },
      undefined
    >
  >;

  type ResultError = VerifyPrivateKeyUseCaseDTO.ResultFailure | ListLicensesUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      licenses: {
        id: string;
        license_number: string;
        environmental_agency: string;
        emission_date: string;
        expiration_date: string;
      }[];
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyPrivateKeyUseCaseDTO } from '@use-cases/authentication/verify-private-key.use-case';
import { GetLicenseUseCaseDTO } from '@use-cases/licenses/get-license.use-case';

import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class GetLicenseController extends Controller<GetLicenseControllerDTO.Parameters, GetLicenseControllerDTO.Result> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyPrivateKeyUseCase: UseCase<
      VerifyPrivateKeyUseCaseDTO.Parameters,
      VerifyPrivateKeyUseCaseDTO.ResultFailure,
      VerifyPrivateKeyUseCaseDTO.ResultSuccess
    >,
    private readonly getLicenseUseCase: UseCase<
      GetLicenseUseCaseDTO.Parameters,
      GetLicenseUseCaseDTO.ResultFailure,
      GetLicenseUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: GetLicenseControllerDTO.Parameters): GetLicenseControllerDTO.Result {
    const { params, headers } = parameters;

    const resultVerifyPrivateKey = await this.verifyPrivateKeyUseCase.execute({
      privateKey: headers['private-key']
    });
    if (resultVerifyPrivateKey.isFailure()) return failure(resultVerifyPrivateKey.value);

    const resultGetLicense = await this.getLicenseUseCase.execute({
      license: { id: params.id }
    });
    if (resultGetLicense.isFailure()) return failure(resultGetLicense.value);
    const { license } = resultGetLicense.value;

    return success({
      data: {
        license: {
          emission_date: license.emissionDate.toISOString(),
          environmental_agency: license.environmentalAgency,
          expiration_date: license.expirationDate.toISOString(),
          id: license.id,
          license_number: license.licenseNumber
        }
      },
      status: StatusSuccess.DONE
    });
  }
}

export namespace GetLicenseControllerDTO {
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

  type ResultError = VerifyPrivateKeyUseCaseDTO.ResultFailure | GetLicenseUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      license: {
        license_number: string;
        environmental_agency: string;
        emission_date: string;
        expiration_date: string;
        id: string;
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

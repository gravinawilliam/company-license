import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyPrivateKeyUseCaseDTO } from '@use-cases/authentication/verify-private-key.use-case';
import { CreateLicenseUseCaseDTO } from '@use-cases/licenses/create-license.use-case';

import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class CreateLicenseController extends Controller<
  CreateLicenseControllerDTO.Parameters,
  CreateLicenseControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyPrivateKeyUseCase: UseCase<
      VerifyPrivateKeyUseCaseDTO.Parameters,
      VerifyPrivateKeyUseCaseDTO.ResultFailure,
      VerifyPrivateKeyUseCaseDTO.ResultSuccess
    >,
    private readonly createLicenseUseCase: UseCase<
      CreateLicenseUseCaseDTO.Parameters,
      CreateLicenseUseCaseDTO.ResultFailure,
      CreateLicenseUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: CreateLicenseControllerDTO.Parameters): CreateLicenseControllerDTO.Result {
    const { body, headers } = parameters;

    const resultVerifyPrivateKey = await this.verifyPrivateKeyUseCase.execute({
      privateKey: headers['private-key']
    });
    if (resultVerifyPrivateKey.isFailure()) return failure(resultVerifyPrivateKey.value);

    const resultCreate = await this.createLicenseUseCase.execute({
      company: {
        id: body.company.id
      },
      licenseInfo: {
        emissionDate: new Date(body.license_info.emission_date),
        expirationDate: new Date(body.license_info.expiration_date),
        licenseNumber: body.license_info.license_number,
        environmentalAgency: body.license_info.environmental_agency
      }
    });
    if (resultCreate.isFailure()) return failure(resultCreate.value);
    const { license } = resultCreate.value;

    return success({
      data: {
        license_created: {
          id: license.id
        }
      },
      status: StatusSuccess.CREATED
    });
  }
}

export namespace CreateLicenseControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      {
        license_info: {
          license_number: string;
          environmental_agency: string;
          emission_date: string;
          expiration_date: string;
        };
        company: {
          id: string;
        };
      },
      {
        ['private-key']: string;
      },
      undefined
    >
  >;

  type ResultError = VerifyPrivateKeyUseCaseDTO.ResultFailure | CreateLicenseUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      license_created: {
        id: string;
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

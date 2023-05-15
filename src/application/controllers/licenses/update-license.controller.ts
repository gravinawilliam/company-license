import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyPrivateKeyUseCaseDTO } from '@use-cases/authentication/verify-private-key.use-case';
import { UpdateLicenseUseCaseDTO } from '@use-cases/licenses/update-license.use-case';

import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class UpdateLicenseController extends Controller<
  UpdateLicenseControllerDTO.Parameters,
  UpdateLicenseControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyPrivateKeyUseCase: UseCase<
      VerifyPrivateKeyUseCaseDTO.Parameters,
      VerifyPrivateKeyUseCaseDTO.ResultFailure,
      VerifyPrivateKeyUseCaseDTO.ResultSuccess
    >,
    private readonly updateLicenseUseCase: UseCase<
      UpdateLicenseUseCaseDTO.Parameters,
      UpdateLicenseUseCaseDTO.ResultFailure,
      UpdateLicenseUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: UpdateLicenseControllerDTO.Parameters): UpdateLicenseControllerDTO.Result {
    const { body, headers, params } = parameters;

    const resultVerifyPrivateKey = await this.verifyPrivateKeyUseCase.execute({
      privateKey: headers['private-key']
    });
    if (resultVerifyPrivateKey.isFailure()) return failure(resultVerifyPrivateKey.value);

    const resultUpdateLicense = await this.updateLicenseUseCase.execute({
      license: { id: params.id },
      licenseUpdate: {
        emissionDate: new Date(body.license_update.emission_date),
        expirationDate: new Date(body.license_update.expiration_date),
        environmentalAgency: body.license_update.environmental_agency,
        licenseNumber: body.license_update.license_number
      }
    });
    if (resultUpdateLicense.isFailure()) return failure(resultUpdateLicense.value);
    const { updatedLicense } = resultUpdateLicense.value;

    return success({
      data: {
        updated_license: {
          emission_date: updatedLicense.emissionDate.toISOString(),
          environmental_agency: updatedLicense.environmentalAgency,
          expiration_date: updatedLicense.expirationDate.toISOString(),
          id: updatedLicense.id,
          license_number: updatedLicense.licenseNumber
        }
      },
      status: StatusSuccess.DONE
    });
  }
}

export namespace UpdateLicenseControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      {
        license_update: {
          license_number: string;
          environmental_agency: string;
          emission_date: string;
          expiration_date: string;
        };
      },
      {
        ['private-key']: string;
      },
      {
        id: string;
      }
    >
  >;

  type ResultError = VerifyPrivateKeyUseCaseDTO.ResultFailure | UpdateLicenseUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      updated_license: {
        id: string;
        license_number: string;
        environmental_agency: string;
        emission_date: string;
        expiration_date: string;
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

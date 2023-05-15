import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdLicensesRepository } from '@contracts/repositories/license/find-by-id.licenses-repository';
import { IFindByLicenseNumberLicensesRepository } from '@contracts/repositories/license/find-by-license-number.licenses-repository';
import { IUpdateLicensesRepository } from '@contracts/repositories/license/update.licenses-repository';

import { UseCase } from '@use-cases/_shared/use-case';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { LicenseNotFoundError } from '@errors/models/license/license-not-found-error';
import { LicenseNumberAlreadyExistsError } from '@errors/models/license/license-number-already-exists.error';

import { License } from '@models/license.model';

import { Either, failure, success } from '@shared/utils/either.util';

export class UpdateLicenseUseCase extends UseCase<
  UpdateLicenseUseCaseDTO.Parameters,
  UpdateLicenseUseCaseDTO.ResultFailure,
  UpdateLicenseUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly licensesRepository: IFindByIdLicensesRepository &
      IFindByLicenseNumberLicensesRepository &
      IUpdateLicensesRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: UpdateLicenseUseCaseDTO.Parameters): UpdateLicenseUseCaseDTO.Result {
    const resultFind = await this.licensesRepository.findById({
      license: { id: parameters.license.id }
    });
    if (resultFind.isFailure()) return failure(resultFind.value);
    const { license } = resultFind.value;

    if (license === null) return failure(new LicenseNotFoundError({ license: { id: parameters.license.id } }));

    if (license.deletedAt !== undefined) {
      return failure(new LicenseNotFoundError({ license: { id: parameters.license.id } }));
    }

    if (parameters.licenseUpdate.licenseNumber !== undefined) {
      const resultFindLicense = await this.licensesRepository.findByLicenseNumber({
        license: { licenseNumber: parameters.licenseUpdate.licenseNumber }
      });
      if (resultFindLicense.isFailure()) return failure(resultFindLicense.value);
      if (resultFindLicense.value.license !== null) {
        return failure(
          new LicenseNumberAlreadyExistsError({
            license: { licenseNumber: resultFindLicense.value.license.licenseNumber }
          })
        );
      }
    }

    const resultUpdateLicense = await this.licensesRepository.update({
      license: {
        id: license.id,
        emissionDate: parameters.licenseUpdate.emissionDate ?? license.emissionDate,
        expirationDate: parameters.licenseUpdate.expirationDate ?? license.expirationDate,
        environmentalAgency: parameters.licenseUpdate.environmentalAgency ?? license.environmentalAgency,
        licenseNumber: parameters.licenseUpdate.licenseNumber ?? license.licenseNumber
      }
    });
    if (resultUpdateLicense.isFailure()) return failure(resultUpdateLicense.value);
    const { updatedLicense } = resultUpdateLicense.value;

    return success({ updatedLicense });
  }
}

export namespace UpdateLicenseUseCaseDTO {
  export type Parameters = Readonly<{
    license: Pick<License, 'id'>;
    licenseUpdate: {
      licenseNumber?: string;
      environmentalAgency?: string;
      emissionDate?: Date;
      expirationDate?: Date;
    };
  }>;

  export type ResultFailure = Readonly<
    RepositoryError | ProviderError | LicenseNotFoundError | LicenseNumberAlreadyExistsError
  >;
  export type ResultSuccess = Readonly<{
    updatedLicense: License;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

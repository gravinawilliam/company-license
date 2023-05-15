import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdCompaniesRepository } from '@contracts/repositories/companies/find-by-id.companies-repository';
import { IFindByLicenseNumberLicensesRepository } from '@contracts/repositories/license/find-by-license-number.licenses-repository';
import { ISaveLicensesRepository } from '@contracts/repositories/license/save.licenses-repository';

import { UseCase } from '@use-cases/_shared/use-case';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { CompanyNotFoundError } from '@errors/models/company/company-not-found-error';
import { LicenseNumberAlreadyExistsError } from '@errors/models/license/license-number-already-exists.error';

import { License } from '@models/license.model';

import { Either, failure, success } from '@shared/utils/either.util';

export class CreateLicenseUseCase extends UseCase<
  CreateLicenseUseCaseDTO.Parameters,
  CreateLicenseUseCaseDTO.ResultFailure,
  CreateLicenseUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly companiesRepository: IFindByIdCompaniesRepository,
    private readonly licensesRepository: IFindByLicenseNumberLicensesRepository & ISaveLicensesRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: CreateLicenseUseCaseDTO.Parameters): CreateLicenseUseCaseDTO.Result {
    const resultFind = await this.companiesRepository.findById({
      company: { id: parameters.company.id }
    });
    if (resultFind.isFailure()) return failure(resultFind.value);
    const { company } = resultFind.value;

    if (company === null) return failure(new CompanyNotFoundError({ company: { id: parameters.company.id } }));

    if (company.deletedAt !== undefined) {
      return failure(new CompanyNotFoundError({ company: { id: parameters.company.id } }));
    }

    const resultFindLicense = await this.licensesRepository.findByLicenseNumber({
      license: { licenseNumber: parameters.licenseInfo.licenseNumber }
    });
    if (resultFindLicense.isFailure()) return failure(resultFindLicense.value);
    if (resultFindLicense.value.license !== null) {
      return failure(
        new LicenseNumberAlreadyExistsError({ license: { licenseNumber: resultFindLicense.value.license.licenseNumber } })
      );
    }

    const resultSaveLicense = await this.licensesRepository.save({
      license: {
        company: { id: parameters.company.id },
        licenseNumber: parameters.licenseInfo.licenseNumber,
        emissionDate: parameters.licenseInfo.emissionDate,
        environmentalAgency: parameters.licenseInfo.environmentalAgency,
        expirationDate: parameters.licenseInfo.expirationDate
      }
    });
    if (resultSaveLicense.isFailure()) return failure(resultSaveLicense.value);

    return success({ license: { id: resultSaveLicense.value.license.id } });
  }
}

export namespace CreateLicenseUseCaseDTO {
  export type Parameters = Readonly<{
    company: {
      id: string;
    };
    licenseInfo: {
      licenseNumber: string;
      environmentalAgency: string;
      emissionDate: Date;
      expirationDate: Date;
    };
  }>;

  export type ResultFailure = Readonly<
    RepositoryError | ProviderError | CompanyNotFoundError | LicenseNumberAlreadyExistsError
  >;
  export type ResultSuccess = Readonly<{
    license: Pick<License, 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

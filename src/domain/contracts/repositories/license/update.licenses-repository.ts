import { RepositoryError } from '@errors/_shared/repository.error';

import { License } from '@models/license.model';

import { Either } from '@shared/utils/either.util';

export namespace UpdateLicensesRepositoryDTO {
  export type Parameters = Readonly<{
    license: Pick<License, 'emissionDate' | 'environmentalAgency' | 'expirationDate' | 'licenseNumber' | 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    updatedLicense: License;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IUpdateLicensesRepository {
  update(parameters: UpdateLicensesRepositoryDTO.Parameters): UpdateLicensesRepositoryDTO.Result;
}

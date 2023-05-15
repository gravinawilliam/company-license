import { RepositoryError } from '@errors/_shared/repository.error';

import { License } from '@models/license.model';

import { Either } from '@shared/utils/either.util';

export namespace FindByLicenseNumberLicensesRepositoryDTO {
  export type Parameters = Readonly<{
    license: Pick<License, 'licenseNumber'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    license: License | null;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindByLicenseNumberLicensesRepository {
  findByLicenseNumber(
    parameters: FindByLicenseNumberLicensesRepositoryDTO.Parameters
  ): FindByLicenseNumberLicensesRepositoryDTO.Result;
}

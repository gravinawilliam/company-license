import { RepositoryError } from '@errors/_shared/repository.error';

import { License } from '@models/license.model';

import { Either } from '@shared/utils/either.util';

export namespace SoftDeleteLicensesRepositoryDTO {
  export type Parameters = Readonly<{
    license: Pick<License, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    license: Required<Pick<License, 'deletedAt' | 'id'>>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISoftDeleteLicensesRepository {
  softDelete(parameters: SoftDeleteLicensesRepositoryDTO.Parameters): SoftDeleteLicensesRepositoryDTO.Result;
}

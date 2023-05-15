import { RepositoryError } from '@errors/_shared/repository.error';

import { License } from '@models/license.model';

import { Either } from '@shared/utils/either.util';

export namespace FindByIdLicensesRepositoryDTO {
  export type Parameters = Readonly<{
    license: Pick<License, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    license: License | null;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindByIdLicensesRepository {
  findById(parameters: FindByIdLicensesRepositoryDTO.Parameters): FindByIdLicensesRepositoryDTO.Result;
}

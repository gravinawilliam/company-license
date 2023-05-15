import { RepositoryError } from '@errors/_shared/repository.error';

import { License } from '@models/license.model';

import { Either } from '@shared/utils/either.util';

export namespace FindAllLicensesRepositoryDTO {
  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    licenses: License[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindAllLicensesRepository {
  findAll(): FindAllLicensesRepositoryDTO.Result;
}

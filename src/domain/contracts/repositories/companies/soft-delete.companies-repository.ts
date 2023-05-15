import { RepositoryError } from '@errors/_shared/repository.error';

import { Company } from '@models/company.model';

import { Either } from '@shared/utils/either.util';

export namespace SoftDeleteCompaniesRepositoryDTO {
  export type Parameters = Readonly<{
    company: Pick<Company, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    company: Required<Pick<Company, 'deletedAt' | 'id'>>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISoftDeleteCompaniesRepository {
  softDelete(parameters: SoftDeleteCompaniesRepositoryDTO.Parameters): SoftDeleteCompaniesRepositoryDTO.Result;
}

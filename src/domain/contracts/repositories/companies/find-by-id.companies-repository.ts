import { RepositoryError } from '@errors/_shared/repository.error';

import { Company } from '@models/company.model';

import { Either } from '@shared/utils/either.util';

export namespace FindByIdCompaniesRepositoryDTO {
  export type Parameters = Readonly<{
    company: Pick<Company, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    company: Company | null;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindByIdCompaniesRepository {
  findById(parameters: FindByIdCompaniesRepositoryDTO.Parameters): FindByIdCompaniesRepositoryDTO.Result;
}

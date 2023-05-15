import { RepositoryError } from '@errors/_shared/repository.error';

import { Company } from '@models/company.model';

import { Either } from '@shared/utils/either.util';

export namespace FindAllCompaniesRepositoryDTO {
  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    companies: Company[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindAllCompaniesRepository {
  findAll(): FindAllCompaniesRepositoryDTO.Result;
}

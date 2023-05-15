import { RepositoryError } from '@errors/_shared/repository.error';

import { Company } from '@models/company.model';

import { Either } from '@shared/utils/either.util';

export namespace UpdateCompaniesRepositoryDTO {
  export type Parameters = Readonly<{
    company: Pick<Company, 'address' | 'corporateName' | 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    updatedCompany: Company;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IUpdateCompaniesRepository {
  update(parameters: UpdateCompaniesRepositoryDTO.Parameters): UpdateCompaniesRepositoryDTO.Result;
}

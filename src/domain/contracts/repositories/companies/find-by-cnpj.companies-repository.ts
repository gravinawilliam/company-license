import { RepositoryError } from '@errors/_shared/repository.error';

import { Company } from '@models/company.model';

import { CNPJ } from '@value-objects/cnpj.value-object';

import { Either } from '@shared/utils/either.util';

export namespace FindByCNPJCompaniesRepositoryDTO {
  export type Parameters = Readonly<{
    cnpj: CNPJ;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    company: Pick<Company, 'id'> | null;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindByCNPJCompaniesRepository {
  findByCNPJ(parameters: FindByCNPJCompaniesRepositoryDTO.Parameters): FindByCNPJCompaniesRepositoryDTO.Result;
}

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { Company } from '@models/company.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveCompaniesRepositoryDTO {
  export type Parameters = Readonly<{
    company: Pick<Company, 'corporateName' | 'cnpj' | 'address'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError>;
  export type ResultSuccess = Readonly<{
    company: Pick<Company, 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISaveCompaniesRepository {
  save(parameters: SaveCompaniesRepositoryDTO.Parameters): SaveCompaniesRepositoryDTO.Result;
}

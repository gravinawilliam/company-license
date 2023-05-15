import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { License } from '@models/license.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveLicensesRepositoryDTO {
  export type Parameters = Readonly<{
    license: Pick<License, 'company' | 'emissionDate' | 'environmentalAgency' | 'expirationDate' | 'licenseNumber'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError>;
  export type ResultSuccess = Readonly<{
    license: Pick<License, 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISaveLicensesRepository {
  save(parameters: SaveLicensesRepositoryDTO.Parameters): SaveLicensesRepositoryDTO.Result;
}

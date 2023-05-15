import { ProviderError } from '@errors/_shared/provider.error';

import { Either } from '@shared/utils/either.util';

export namespace GetZipCodeDataAddressProviderDTO {
  export type Parameters = Readonly<{
    zipCode: string;
  }>;

  export type ResultFailure = Readonly<ProviderError>;
  export type ResultSuccess = Readonly<{
    address: { zipCode: string } | null;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IGetZipCodeDataAddressProvider {
  getZipCodeData(parameters: GetZipCodeDataAddressProviderDTO.Parameters): GetZipCodeDataAddressProviderDTO.Result;
}

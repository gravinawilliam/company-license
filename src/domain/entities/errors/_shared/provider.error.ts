import { StatusError } from './status-error';

type ParametersConstructorDTO = {
  error?: Error;
  provider: {
    name: ProvidersNames;
    method: AddressProviderMethods | CompanyProviderMethods | CryptoProviderMethods;
    externalName?: string;
  };
};

export enum ProvidersNames {
  ADDRESS = 'address',
  COMPANY = 'company',
  CRYPTO = 'crypto'
}

export enum AddressProviderMethods {
  GET_ZIP_CODE_DATA = 'get zip code data'
}

export enum CompanyProviderMethods {
  GET_CNPJ_DATA = 'get cnpj data'
}

export enum CryptoProviderMethods {
  GENERATE_ID = 'generate id'
}

export class ProviderError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'ProviderError';

  readonly error?: Error;

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'ProviderError';
    this.message = `Error in ${parameters.provider.name} provider in ${parameters.provider.method} method.${
      parameters.provider.externalName === undefined
        ? ''
        : ` Error in external lib name: ${parameters.provider.externalName}.`
    }`;
    this.status = StatusError.PROVIDER_ERROR;
    this.error = parameters.error;
  }
}

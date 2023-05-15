import cep from 'cep-promise';

import {
  GetZipCodeDataAddressProviderDTO,
  IGetZipCodeDataAddressProvider
} from '@contracts/providers/address/get-zip-code-data.address-provider';
import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';

import { AddressProviderMethods, ProviderError, ProvidersNames } from '@errors/_shared/provider.error';

import { failure, success } from '@shared/utils/either.util';

export class CepPromiseAddressProvider implements IGetZipCodeDataAddressProvider {
  constructor(private readonly loggerProvider: ISendLogErrorLoggerProvider) {}

  public async getZipCodeData(
    parameters: GetZipCodeDataAddressProviderDTO.Parameters
  ): GetZipCodeDataAddressProviderDTO.Result {
    try {
      const cepData = await cep(parameters.zipCode);
      return success({ address: { zipCode: cepData.cep } });
    } catch (error: any) {
      const errorProvider = new ProviderError({
        error,
        provider: {
          name: ProvidersNames.ADDRESS,
          method: AddressProviderMethods.GET_ZIP_CODE_DATA,
          externalName: 'cep-promise'
        }
      });

      this.loggerProvider.sendLogError({
        message: errorProvider.message,
        value: error
      });

      return failure(errorProvider);
    }
  }
}

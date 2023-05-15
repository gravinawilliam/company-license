import { IGetZipCodeDataAddressProvider } from '@contracts/providers/address/get-zip-code-data.address-provider';

import { CepPromiseAddressProvider } from '@infrastructure/providers/address/cep-promise.address-provider';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeAddressProvider = (): IGetZipCodeDataAddressProvider =>
  new CepPromiseAddressProvider(makeLoggerProvider());

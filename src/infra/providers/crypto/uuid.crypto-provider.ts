import { v4 } from 'uuid';

import {
  GenerateIdCryptoProviderDTO,
  IGenerateIdCryptoProvider
} from '@contracts/providers/crypto/generate-id.crypto-provider';
import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';

import { CryptoProviderMethods, ProviderError, ProvidersNames } from '@errors/_shared/provider.error';

import { failure, success } from '@shared/utils/either.util';

export class UuidCryptoProvider implements IGenerateIdCryptoProvider {
  constructor(private readonly loggerProvider: ISendLogErrorLoggerProvider) {}

  public generateId(): GenerateIdCryptoProviderDTO.Result {
    try {
      return success({ id: v4() });
    } catch (error: any) {
      const errorProvider = new ProviderError({
        error,
        provider: {
          name: ProvidersNames.CRYPTO,
          method: CryptoProviderMethods.GENERATE_ID,
          externalName: 'uuid'
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

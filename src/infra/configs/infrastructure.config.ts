import {
  getEnvironmentNumber,
  getEnvironmentString
} from '@infra/providers/get-envs/dot-environment.get-environments-provider';

enum NODE_ENV {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION'
}

export const GLOBAL_CONFIG = {
  ENVIRONMENT: getEnvironmentString({
    defaultValue: NODE_ENV.DEVELOPMENT,
    key: 'NODE_ENV'
  }),
  IS_DEVELOPMENT:
    getEnvironmentString({
      defaultValue: NODE_ENV.DEVELOPMENT,
      key: 'NODE_ENV'
    }) === NODE_ENV.DEVELOPMENT,
  IS_PRODUCTION:
    getEnvironmentString({
      defaultValue: NODE_ENV.DEVELOPMENT,
      key: 'NODE_ENV'
    }) === NODE_ENV.PRODUCTION,
  APP_NAME: getEnvironmentString({
    defaultValue: 'User Account',
    key: 'APP_NAME'
  }),
  APP_PORT: getEnvironmentNumber({
    defaultValue: 2222,
    key: 'APP_PORT'
  })
};

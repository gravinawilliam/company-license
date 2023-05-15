import endent from 'endent';
import figlet from 'figlet';

import { GLOBAL_CONFIG } from '@infrastructure/configs/infrastructure.config';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const showBanner = () => {
  const banner = endent`Application started successfully!
      ${figlet.textSync(GLOBAL_CONFIG.APP_NAME)}
       Name: ${GLOBAL_CONFIG.APP_NAME}
       Port: ${GLOBAL_CONFIG.APP_PORT}
       Environment: ${GLOBAL_CONFIG.ENVIRONMENT}
    `;
  makeLoggerProvider().sendLogInfo({ message: banner });
};

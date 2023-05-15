import { StatusError } from '@errors/_shared/status-error';

import { License } from '@models/license.model';

type ParametersConstructorDTO = { license: Pick<License, 'licenseNumber'> };

export class LicenseNumberAlreadyExistsError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'LicenseNumberAlreadyExistsError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'LicenseNumberAlreadyExistsError';
    this.message = `This license number ${parameters.license.licenseNumber} already exists.`;
    this.status = StatusError.ALREADY_EXISTS;
  }
}

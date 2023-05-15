import { StatusError } from '@errors/_shared/status-error';

import { License } from '@models/license.model';

type ParametersConstructorDTO = {
  license: Pick<License, 'id'>;
};

export class LicenseNotFoundError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'LicenseNotFoundError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'LicenseNotFoundError';
    this.message = `License with id ${parameters.license.id} not found.`;
    this.status = StatusError.NOT_FOUND;
  }
}

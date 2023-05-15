import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = { corporateName: string };

export class InvalidCorporateNameError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidCorporateNameError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'InvalidCorporateNameError';
    this.message = `This corporate name ${parameters.corporateName} is invalid.`;
    this.status = StatusError.INVALID;
  }
}

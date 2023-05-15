import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = {
  cnpj: string;
  motive: InvalidCNPJMotive;
};

export enum InvalidCNPJMotive {
  INVALID_FORMAT = 'in invalid format',
  NOT_FOUND = 'zip code not found'
}

export class InvalidCNPJError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidCNPJError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'InvalidCNPJError';
    this.message = `Invalid cnpj ${parameters.cnpj} because ${parameters.motive}.`;
    this.status = StatusError.INVALID;
  }
}

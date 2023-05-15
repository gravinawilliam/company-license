import { StatusError } from '@errors/_shared/status-error';

import { CNPJ } from '@value-objects/cnpj.value-object';

type ParametersConstructorDTO = { cnpj: CNPJ };

export class CNPJAlreadyExistsError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'CNPJAlreadyExistsError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'CNPJAlreadyExistsError';
    this.message = `This cnpj ${parameters.cnpj.value} already exists.`;
    this.status = StatusError.ALREADY_EXISTS;
  }
}

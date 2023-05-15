import { StatusError } from '@errors/_shared/status-error';

import { Company } from '@models/company.model';

type ParametersConstructorDTO = {
  company: Pick<Company, 'id'>;
};

export class CompanyNotFoundError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'CompanyNotFoundError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'CompanyNotFoundError';
    this.message = `Company with id ${parameters.company.id} not found.`;
    this.status = StatusError.NOT_FOUND;
  }
}

import { StatusError } from './status-error';

type ParametersConstructorDTO = {
  error?: Error;
  repository: {
    name: RepositoriesNames;
    method: CompaniesRepositoryMethods | LicensesRepositoryMethods;
    externalName?: string;
  };
};

export enum RepositoriesNames {
  COMPANIES = 'companies',
  LICENSES = 'licenses'
}

export enum CompaniesRepositoryMethods {
  FIND_ALL = 'find all',
  FIND_BY_CNPJ = 'find by cnpj',
  FIND_BY_ID = 'find by id',
  SAVE = 'save',
  SOFT_DELETE = 'soft delete',
  UPDATE = 'update'
}

export enum LicensesRepositoryMethods {
  FIND_ALL = 'find all',
  FIND_BY_ID = 'find by id',
  FIND_BY_LICENSE_NUMBER = 'find by license number',
  SAVE = 'save',
  SOFT_DELETE = 'soft delete',
  UPDATE = 'update'
}

export class RepositoryError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'RepositoryError';

  readonly error?: Error;

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'RepositoryError';
    this.message = `Error in ${parameters.repository.name} repository in ${parameters.repository.method} method.${
      parameters.repository.externalName === undefined
        ? ''
        : ` Error in external lib name: ${parameters.repository.externalName}.`
    }`;
    this.status = StatusError.REPOSITORY_ERROR;
    this.error = parameters.error;
  }
}

import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = {
  motive: InvalidCompanyAddressMotive;
};

export enum InvalidCompanyAddressMotive {
  ZIP_CODE_INVALID_FORMAT = 'zip code in invalid format',
  ZIP_CODE_NOT_FOUND = 'zip code not found',
  CITY_NAME_EMPTY = 'city name is empty',
  STATE_NAME_EMPTY = 'state name is empty',
  STREET_NAME_EMPTY = 'street name is empty',
  NEIGHBORHOOD_NAME_EMPTY = 'neighborhood name is empty'
}

export class InvalidCompanyAddressError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidCompanyAddressError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'InvalidCompanyAddressError';
    this.message = `Invalid company address because ${parameters.motive}.`;
    this.status = StatusError.INVALID;
  }
}

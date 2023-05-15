import {
  InvalidCompanyAddressError,
  InvalidCompanyAddressMotive
} from '@errors/models/company/invalid-company-address.error';
import { InvalidCorporateNameError } from '@errors/models/company/invalid-corporate-name.error';

import { CNPJ } from '@value-objects/cnpj.value-object';

import { Either, failure, success } from '@shared/utils/either.util';

export class Company {
  readonly id: string;

  readonly corporateName: string;

  readonly cnpj: CNPJ;

  readonly address: CompanyAddress;

  readonly deletedAt?: Date;

  constructor(parameters: Company) {
    this.id = parameters.id;
    this.corporateName = parameters.corporateName;
    this.cnpj = parameters.cnpj;
    this.address = parameters.address;
    this.deletedAt = parameters.deletedAt;
  }

  public static validateCorporateName(parameters: {
    corporateName: string;
  }): Either<InvalidCorporateNameError, { validatedCorporateName: string }> {
    const formattedCorporateName = parameters.corporateName.trim();
    if (formattedCorporateName.length === 0) {
      return failure(new InvalidCorporateNameError({ corporateName: formattedCorporateName }));
    }

    return success({ validatedCorporateName: formattedCorporateName });
  }

  public static validateAddress(
    parameters: CompanyAddress
  ): Either<InvalidCompanyAddressError, { validatedAddress: CompanyAddress }> {
    const formattedAddress = {
      zipCode: parameters.zipCode.trim().replaceAll('-', ''),
      city: parameters.city.trim(),
      state: parameters.state.trim(),
      street: parameters.street.trim(),
      neighborhood: parameters.neighborhood.trim(),
      complement: parameters.complement.trim()
    };

    if (formattedAddress.zipCode.length !== 8) {
      return failure(
        new InvalidCompanyAddressError({
          motive: InvalidCompanyAddressMotive.ZIP_CODE_INVALID_FORMAT
        })
      );
    }

    const regexZipCode = /^\d{8}$/;
    if (regexZipCode.test(formattedAddress.zipCode) === false) {
      return failure(
        new InvalidCompanyAddressError({
          motive: InvalidCompanyAddressMotive.ZIP_CODE_INVALID_FORMAT
        })
      );
    }

    if (formattedAddress.city.length === 0) {
      return failure(
        new InvalidCompanyAddressError({
          motive: InvalidCompanyAddressMotive.CITY_NAME_EMPTY
        })
      );
    }

    if (formattedAddress.state.length === 0) {
      return failure(
        new InvalidCompanyAddressError({
          motive: InvalidCompanyAddressMotive.STATE_NAME_EMPTY
        })
      );
    }

    if (formattedAddress.street.length === 0) {
      return failure(
        new InvalidCompanyAddressError({
          motive: InvalidCompanyAddressMotive.STREET_NAME_EMPTY
        })
      );
    }

    if (formattedAddress.neighborhood.length === 0) {
      return failure(
        new InvalidCompanyAddressError({
          motive: InvalidCompanyAddressMotive.NEIGHBORHOOD_NAME_EMPTY
        })
      );
    }

    return success({ validatedAddress: formattedAddress });
  }
}

export type CompanyAddress = {
  zipCode: string;
  city: string;
  state: string;
  neighborhood: string;
  street: string;
  complement: string;
};

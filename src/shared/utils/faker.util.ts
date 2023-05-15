import { generateCNPJ } from '@brazilian-utils/brazilian-utils';
import { fakerPT_BR as faker } from '@faker-js/faker';

import { Company } from '@models/company.model';

import { CNPJ } from '@value-objects/cnpj.value-object';

export const id = (): string => faker.string.uuid();

export const date = (): Date => faker.date.recent();

// * Address
export const zipCode = (): string => faker.location.zipCode('########');
export const city = (): string => faker.location.city();
export const street = (): string => faker.location.streetAddress();
export const neighborhood = (): string => faker.location.county();
export const state = (): string => faker.location.state();
export const complement = (): string => faker.location.secondaryAddress();

// * Company
export const cnpj = (): CNPJ => new CNPJ({ cnpj: generateCNPJ() });
export const corporateName = (): string => faker.company.name();

export const company = (parameters: Partial<Company>): Company =>
  new Company({
    id: parameters.id ?? id(),
    corporateName: corporateName(),
    cnpj: parameters.cnpj ?? cnpj(),
    deletedAt: undefined,
    address: {
      city: city(),
      neighborhood: neighborhood(),
      state: state(),
      street: street(),
      complement: complement(),
      zipCode: zipCode()
    }
  });

import { MockProxy, mock } from 'jest-mock-extended';

import {
  GetZipCodeDataAddressProviderDTO,
  IGetZipCodeDataAddressProvider
} from '@contracts/providers/address/get-zip-code-data.address-provider';
import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdCompaniesRepository } from '@contracts/repositories/companies/find-by-id.companies-repository';
import { IUpdateCompaniesRepository } from '@contracts/repositories/companies/update.companies-repository';

import { UseCase } from '@use-cases/_shared/use-case';
import { UpdateCompanyUseCase, UpdateCompanyUseCaseDTO } from '@use-cases/companies/update-company.use-case';

import { AddressProviderMethods, ProviderError, ProvidersNames } from '@errors/_shared/provider.error';
import { CompaniesRepositoryMethods, RepositoriesNames, RepositoryError } from '@errors/_shared/repository.error';
import { CompanyNotFoundError } from '@errors/models/company/company-not-found-error';
import {
  InvalidCompanyAddressError,
  InvalidCompanyAddressMotive
} from '@errors/models/company/invalid-company-address.error';
import { InvalidCorporateNameError } from '@errors/models/company/invalid-corporate-name.error';

import { Company } from '@models/company.model';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('Update company USE CASE', () => {
  let sut: UseCase<
    UpdateCompanyUseCaseDTO.Parameters,
    UpdateCompanyUseCaseDTO.ResultFailure,
    UpdateCompanyUseCaseDTO.ResultSuccess
  >;
  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let companiesRepository: MockProxy<IFindByIdCompaniesRepository & IUpdateCompaniesRepository>;
  let addressProvider: MockProxy<IGetZipCodeDataAddressProvider>;

  let correctParametersSut: UpdateCompanyUseCaseDTO.Parameters;
  const COMPANY: Company = Generate.company({});
  const UPDATED_COMPANY: Company = Generate.company({ cnpj: COMPANY.cnpj, id: COMPANY.id });

  beforeAll(() => {
    loggerProvider = mock();
    loggerProvider.sendLogTimeUseCase.mockReturnValue();

    companiesRepository = mock();
    companiesRepository.findById.mockResolvedValue(success({ company: COMPANY }));
    companiesRepository.update.mockResolvedValue(success({ updatedCompany: UPDATED_COMPANY }));

    addressProvider = mock();
    addressProvider.getZipCodeData.mockResolvedValue(success({ address: { zipCode: COMPANY.address.zipCode } }));
  });

  beforeEach(() => {
    correctParametersSut = {
      company: { id: COMPANY.id },
      companyUpdate: {
        address: UPDATED_COMPANY.address,
        corporateName: UPDATED_COMPANY.corporateName
      }
    };

    sut = new UpdateCompanyUseCase(loggerProvider, companiesRepository, addressProvider);
  });

  it('should return RepositoryError if find by id companies repository return Error', async () => {
    const error = new RepositoryError({
      repository: {
        method: CompaniesRepositoryMethods.FIND_BY_ID,
        name: RepositoriesNames.COMPANIES
      }
    });
    companiesRepository.findById.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(0);
    expect(companiesRepository.update).toHaveBeenCalledTimes(0);
  });

  it('should return CompanyNotFoundError if find by id companies repository not return company', async () => {
    const error = new CompanyNotFoundError({ company: { id: COMPANY.id } });
    companiesRepository.findById.mockResolvedValueOnce(success({ company: null }));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(0);
    expect(companiesRepository.update).toHaveBeenCalledTimes(0);
  });

  it('should return InvalidCorporateNameError if validate corporate name return Error', async () => {
    const invalidCorporateName = '';
    const error = new InvalidCorporateNameError({
      corporateName: invalidCorporateName
    });

    const result = await sut.execute({
      ...correctParametersSut,
      companyUpdate: {
        ...correctParametersSut.companyUpdate,
        corporateName: invalidCorporateName
      }
    });

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(0);
    expect(companiesRepository.update).toHaveBeenCalledTimes(0);
  });

  it('should return InvalidCompanyAddressError if validate address return Error', async () => {
    const invalidZipCode = '1234';
    const error = new InvalidCompanyAddressError({
      motive: InvalidCompanyAddressMotive.ZIP_CODE_INVALID_FORMAT
    });

    const result = await sut.execute({
      ...correctParametersSut,
      companyUpdate: {
        corporateName: undefined,
        address: {
          ...correctParametersSut.companyUpdate.address,
          zipCode: invalidZipCode
        }
      }
    });

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(0);
    expect(companiesRepository.update).toHaveBeenCalledTimes(0);
  });

  it('should call get zip code data address provider with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(addressProvider.getZipCodeData).toHaveBeenCalledWith({
      zipCode: correctParametersSut.companyUpdate.address.zipCode
    } as GetZipCodeDataAddressProviderDTO.Parameters);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
  });

  it('should return ProviderError if get zip code data address provider return Error', async () => {
    const error = new ProviderError({
      provider: {
        method: AddressProviderMethods.GET_ZIP_CODE_DATA,
        name: ProvidersNames.ADDRESS
      }
    });
    addressProvider.getZipCodeData.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.update).toHaveBeenCalledTimes(0);
  });

  it('should return InvalidCompanyAddressError if get zip code data address provider return address null', async () => {
    const error = new InvalidCompanyAddressError({
      motive: InvalidCompanyAddressMotive.ZIP_CODE_NOT_FOUND
    });
    addressProvider.getZipCodeData.mockResolvedValueOnce(success({ address: null }));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.update).toHaveBeenCalledTimes(0);
  });

  it('should return RepositoryError if update companies repository return Error', async () => {
    const error = new RepositoryError({
      repository: {
        method: CompaniesRepositoryMethods.UPDATE,
        name: RepositoriesNames.COMPANIES
      }
    });
    companiesRepository.update.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should successfully update company', async () => {
    const responseSuccess: UpdateCompanyUseCaseDTO.ResultSuccess = {
      updatedCompany: UPDATED_COMPANY
    };

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(responseSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should successfully update company with address undefined', async () => {
    const responseSuccess: UpdateCompanyUseCaseDTO.ResultSuccess = {
      updatedCompany: {
        ...UPDATED_COMPANY,
        address: COMPANY.address
      }
    };
    companiesRepository.update.mockResolvedValueOnce(
      success({
        updatedCompany: {
          ...UPDATED_COMPANY,
          address: COMPANY.address
        }
      })
    );

    const result = await sut.execute({
      company: { id: COMPANY.id },
      companyUpdate: {
        address: {
          city: undefined,
          neighborhood: undefined,
          complement: undefined,
          state: undefined,
          street: undefined,
          zipCode: undefined
        },
        corporateName: UPDATED_COMPANY.corporateName
      }
    });

    expect(result.value).toEqual(responseSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(0);
    expect(companiesRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should successfully update company with corporate name undefined', async () => {
    const responseSuccess: UpdateCompanyUseCaseDTO.ResultSuccess = {
      updatedCompany: {
        ...UPDATED_COMPANY,
        corporateName: COMPANY.corporateName
      }
    };
    companiesRepository.update.mockResolvedValueOnce(
      success({
        updatedCompany: {
          ...UPDATED_COMPANY,
          corporateName: COMPANY.corporateName
        }
      })
    );

    const result = await sut.execute({
      company: { id: COMPANY.id },
      companyUpdate: {
        address: UPDATED_COMPANY.address,
        corporateName: undefined
      }
    });

    expect(result.value).toEqual(responseSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.update).toHaveBeenCalledTimes(1);
  });
});

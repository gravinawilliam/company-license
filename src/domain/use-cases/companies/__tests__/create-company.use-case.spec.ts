import { MockProxy, mock } from 'jest-mock-extended';

import {
  GetZipCodeDataAddressProviderDTO,
  IGetZipCodeDataAddressProvider
} from '@contracts/providers/address/get-zip-code-data.address-provider';
import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByCNPJCompaniesRepository } from '@contracts/repositories/companies/find-by-cnpj.companies-repository';
import { ISaveCompaniesRepository } from '@contracts/repositories/companies/save.companies-repository';

import { UseCase } from '@use-cases/_shared/use-case';
import { CreateCompanyUseCase, CreateCompanyUseCaseDTO } from '@use-cases/companies/create-company.use-case';

import { AddressProviderMethods, ProviderError, ProvidersNames } from '@errors/_shared/provider.error';
import { CompaniesRepositoryMethods, RepositoriesNames, RepositoryError } from '@errors/_shared/repository.error';
import {
  InvalidCompanyAddressError,
  InvalidCompanyAddressMotive
} from '@errors/models/company/invalid-company-address.error';
import { InvalidCorporateNameError } from '@errors/models/company/invalid-corporate-name.error';
import { CNPJAlreadyExistsError } from '@errors/value-objects/cnpj/cnpj-already-exists.error';
import { InvalidCNPJError, InvalidCNPJMotive } from '@errors/value-objects/cnpj/invalid-cnpj.error';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('Create company USE CASE', () => {
  let sut: UseCase<
    CreateCompanyUseCaseDTO.Parameters,
    CreateCompanyUseCaseDTO.ResultFailure,
    CreateCompanyUseCaseDTO.ResultSuccess
  >;
  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let addressProvider: MockProxy<IGetZipCodeDataAddressProvider>;
  let companiesRepository: MockProxy<IFindByCNPJCompaniesRepository & ISaveCompaniesRepository>;

  const COMPANY_ZIP_CODE = Generate.zipCode();
  const COMPANY_CNPJ = Generate.cnpj();
  const COMPANY_ID = Generate.id();

  let correctParametersSut: CreateCompanyUseCaseDTO.Parameters;

  beforeAll(() => {
    loggerProvider = mock();
    loggerProvider.sendLogTimeUseCase.mockReturnValue();

    addressProvider = mock();
    addressProvider.getZipCodeData.mockResolvedValue(success({ address: { zipCode: COMPANY_ZIP_CODE } }));

    companiesRepository = mock();
    companiesRepository.findByCNPJ.mockResolvedValue(success({ company: null }));
    companiesRepository.save.mockResolvedValue(success({ company: { id: COMPANY_ID } }));
  });

  beforeEach(() => {
    correctParametersSut = {
      companyInfo: {
        cnpj: COMPANY_CNPJ.value,
        corporateName: Generate.corporateName(),
        address: {
          zipCode: COMPANY_ZIP_CODE,
          city: Generate.city(),
          neighborhood: Generate.neighborhood(),
          state: Generate.state(),
          street: Generate.street(),
          complement: Generate.complement()
        }
      }
    };

    sut = new CreateCompanyUseCase(loggerProvider, addressProvider, companiesRepository);
  });

  it('should return InvalidCNPJError if validate cnpj return Error', async () => {
    const invalidCNPJ = '12345678901234';
    const error = new InvalidCNPJError({
      cnpj: invalidCNPJ,
      motive: InvalidCNPJMotive.INVALID_FORMAT
    });

    const result = await sut.execute({
      companyInfo: {
        ...correctParametersSut.companyInfo,
        cnpj: invalidCNPJ
      }
    });

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(0);
    expect(companiesRepository.findByCNPJ).toHaveBeenCalledTimes(0);
    expect(companiesRepository.save).toHaveBeenCalledTimes(0);
  });

  it('should return InvalidCorporateNameError if validate corporate name return Error', async () => {
    const invalidCorporateName = '';
    const error = new InvalidCorporateNameError({
      corporateName: invalidCorporateName
    });

    const result = await sut.execute({
      companyInfo: {
        ...correctParametersSut.companyInfo,
        corporateName: invalidCorporateName
      }
    });

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(0);
    expect(companiesRepository.findByCNPJ).toHaveBeenCalledTimes(0);
    expect(companiesRepository.save).toHaveBeenCalledTimes(0);
  });

  it('should return InvalidCompanyAddressError if validate address return Error', async () => {
    const invalidZipCode = '1234';
    const error = new InvalidCompanyAddressError({
      motive: InvalidCompanyAddressMotive.ZIP_CODE_INVALID_FORMAT
    });

    const result = await sut.execute({
      companyInfo: {
        ...correctParametersSut.companyInfo,
        address: {
          ...correctParametersSut.companyInfo.address,
          zipCode: invalidZipCode
        }
      }
    });

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(0);
    expect(companiesRepository.findByCNPJ).toHaveBeenCalledTimes(0);
    expect(companiesRepository.save).toHaveBeenCalledTimes(0);
  });

  it('should call get zip code data address provider with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(addressProvider.getZipCodeData).toHaveBeenCalledWith({
      zipCode: correctParametersSut.companyInfo.address.zipCode
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
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.findByCNPJ).toHaveBeenCalledTimes(0);
    expect(companiesRepository.save).toHaveBeenCalledTimes(0);
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
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.findByCNPJ).toHaveBeenCalledTimes(0);
    expect(companiesRepository.save).toHaveBeenCalledTimes(0);
  });

  it('should return RepositoryError if find by cnpj companies repository return Error', async () => {
    const error = new RepositoryError({
      repository: {
        method: CompaniesRepositoryMethods.FIND_BY_CNPJ,
        name: RepositoriesNames.COMPANIES
      }
    });
    companiesRepository.findByCNPJ.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.findByCNPJ).toHaveBeenCalledTimes(1);
    expect(companiesRepository.save).toHaveBeenCalledTimes(0);
  });

  it('should return CNPJAlreadyExistsError if find by cnpj companies repository return company', async () => {
    const error = new CNPJAlreadyExistsError({ cnpj: COMPANY_CNPJ });
    companiesRepository.findByCNPJ.mockResolvedValueOnce(success({ company: { id: COMPANY_ID } }));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.findByCNPJ).toHaveBeenCalledTimes(1);
    expect(companiesRepository.save).toHaveBeenCalledTimes(0);
  });

  it('should return RepositoryError if save companies repository return Error', async () => {
    const error = new RepositoryError({
      repository: {
        method: CompaniesRepositoryMethods.SAVE,
        name: RepositoriesNames.COMPANIES
      }
    });
    companiesRepository.save.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.findByCNPJ).toHaveBeenCalledTimes(1);
    expect(companiesRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should successfully create company', async () => {
    const responseSuccess: CreateCompanyUseCaseDTO.ResultSuccess = {
      company: {
        address: {
          city: correctParametersSut.companyInfo.address.city,
          neighborhood: correctParametersSut.companyInfo.address.neighborhood,
          complement: correctParametersSut.companyInfo.address.complement,
          state: correctParametersSut.companyInfo.address.state,
          street: correctParametersSut.companyInfo.address.street,
          zipCode: COMPANY_ZIP_CODE
        },
        corporateName: correctParametersSut.companyInfo.corporateName,
        cnpj: COMPANY_CNPJ,
        id: COMPANY_ID
      }
    };

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(responseSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
    expect(addressProvider.getZipCodeData).toHaveBeenCalledTimes(1);
    expect(companiesRepository.findByCNPJ).toHaveBeenCalledTimes(1);
    expect(companiesRepository.save).toHaveBeenCalledTimes(1);
  });
});

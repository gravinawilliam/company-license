import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdCompaniesRepository } from '@contracts/repositories/companies/find-by-id.companies-repository';

import { UseCase } from '@use-cases/_shared/use-case';
import { GetCompanyUseCase, GetCompanyUseCaseDTO } from '@use-cases/companies/get-company.use-case';

import { CompaniesRepositoryMethods, RepositoriesNames, RepositoryError } from '@errors/_shared/repository.error';
import { CompanyNotFoundError } from '@errors/models/company/company-not-found-error';

import { Company } from '@models/company.model';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('Get company USE CASE', () => {
  let sut: UseCase<
    GetCompanyUseCaseDTO.Parameters,
    GetCompanyUseCaseDTO.ResultFailure,
    GetCompanyUseCaseDTO.ResultSuccess
  >;
  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let companiesRepository: MockProxy<IFindByIdCompaniesRepository>;

  let correctParametersSut: GetCompanyUseCaseDTO.Parameters;
  const COMPANY: Company = Generate.company({});

  beforeAll(() => {
    loggerProvider = mock();
    loggerProvider.sendLogTimeUseCase.mockReturnValue();

    companiesRepository = mock();
    companiesRepository.findById.mockResolvedValue(success({ company: COMPANY }));
  });

  beforeEach(() => {
    correctParametersSut = { company: { id: COMPANY.id } };

    sut = new GetCompanyUseCase(loggerProvider, companiesRepository);
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
  });

  it('should return CompanyNotFoundError if find by id companies repository not return company', async () => {
    const error = new CompanyNotFoundError({ company: { id: COMPANY.id } });
    companiesRepository.findById.mockResolvedValueOnce(success({ company: null }));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should return CompanyNotFoundError if find by id companies repository return company with deletedAt', async () => {
    const error = new CompanyNotFoundError({ company: { id: COMPANY.id } });
    companiesRepository.findById.mockResolvedValueOnce(
      success({
        company: {
          ...COMPANY,
          deletedAt: Generate.date()
        }
      })
    );

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should successfully get company', async () => {
    const responseSuccess: GetCompanyUseCaseDTO.ResultSuccess = {
      company: COMPANY
    };

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(responseSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
  });
});

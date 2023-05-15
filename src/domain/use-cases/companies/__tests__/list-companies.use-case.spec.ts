import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindAllCompaniesRepository } from '@contracts/repositories/companies/find-all.companies-repository';

import { UseCase } from '@use-cases/_shared/use-case';
import { ListCompaniesUseCase, ListCompaniesUseCaseDTO } from '@use-cases/companies/list-companies.use-case';

import { CompaniesRepositoryMethods, RepositoriesNames, RepositoryError } from '@errors/_shared/repository.error';

import { Company } from '@models/company.model';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('List companies USE CASE', () => {
  let sut: UseCase<
    ListCompaniesUseCaseDTO.Parameters,
    ListCompaniesUseCaseDTO.ResultFailure,
    ListCompaniesUseCaseDTO.ResultSuccess
  >;
  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let companiesRepository: MockProxy<IFindAllCompaniesRepository>;

  let correctParametersSut: ListCompaniesUseCaseDTO.Parameters;
  const COMPANIES: Company[] = [Generate.company({}), Generate.company({}), Generate.company({})];

  beforeAll(() => {
    loggerProvider = mock();
    loggerProvider.sendLogTimeUseCase.mockReturnValue();

    companiesRepository = mock();
    companiesRepository.findAll.mockResolvedValue(success({ companies: COMPANIES }));
  });

  beforeEach(() => {
    correctParametersSut = undefined;

    sut = new ListCompaniesUseCase(loggerProvider, companiesRepository);
  });

  it('should return RepositoryError if find all companies repository return Error', async () => {
    const error = new RepositoryError({
      repository: {
        method: CompaniesRepositoryMethods.FIND_ALL,
        name: RepositoriesNames.COMPANIES
      }
    });
    companiesRepository.findAll.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should successfully list companies', async () => {
    const responseSuccess: ListCompaniesUseCaseDTO.ResultSuccess = {
      companies: COMPANIES
    };

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(responseSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
    expect(companiesRepository.findAll).toHaveBeenCalledTimes(1);
  });
});

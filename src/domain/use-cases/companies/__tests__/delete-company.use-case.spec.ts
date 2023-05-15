import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdCompaniesRepository } from '@contracts/repositories/companies/find-by-id.companies-repository';
import { ISoftDeleteCompaniesRepository } from '@contracts/repositories/companies/soft-delete.companies-repository';

import { UseCase } from '@use-cases/_shared/use-case';
import { DeleteCompanyUseCase, DeleteCompanyUseCaseDTO } from '@use-cases/companies/delete-company.use-case';

import { CompaniesRepositoryMethods, RepositoriesNames, RepositoryError } from '@errors/_shared/repository.error';
import { CompanyNotFoundError } from '@errors/models/company/company-not-found-error';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('Delete company USE CASE', () => {
  let sut: UseCase<
    DeleteCompanyUseCaseDTO.Parameters,
    DeleteCompanyUseCaseDTO.ResultFailure,
    DeleteCompanyUseCaseDTO.ResultSuccess
  >;
  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let companiesRepository: MockProxy<IFindByIdCompaniesRepository & ISoftDeleteCompaniesRepository>;

  const COMPANY_ID = Generate.id();
  const COMPANY_DELETED_AT = Generate.date();

  let correctParametersSut: DeleteCompanyUseCaseDTO.Parameters;

  beforeAll(() => {
    loggerProvider = mock();
    loggerProvider.sendLogTimeUseCase.mockReturnValue();

    companiesRepository = mock();
    companiesRepository.findById.mockResolvedValue(
      success({
        company: {
          id: COMPANY_ID,
          corporateName: Generate.corporateName(),
          cnpj: Generate.cnpj(),
          address: {
            city: Generate.city(),
            neighborhood: Generate.neighborhood(),
            state: Generate.state(),
            street: Generate.street(),
            complement: Generate.complement(),
            zipCode: Generate.zipCode()
          }
        }
      })
    );
    companiesRepository.softDelete.mockResolvedValue(
      success({
        company: {
          deletedAt: COMPANY_DELETED_AT,
          id: COMPANY_ID
        }
      })
    );
  });

  beforeEach(() => {
    correctParametersSut = { company: { id: COMPANY_ID } };

    sut = new DeleteCompanyUseCase(loggerProvider, companiesRepository);
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
    expect(companiesRepository.softDelete).toHaveBeenCalledTimes(0);
  });

  it('should return CompanyNotFoundError if find by id companies repository not return company', async () => {
    const error = new CompanyNotFoundError({ company: { id: COMPANY_ID } });
    companiesRepository.findById.mockResolvedValueOnce(success({ company: null }));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(companiesRepository.softDelete).toHaveBeenCalledTimes(0);
  });

  it('should return RepositoryError if soft delete companies repository return Error', async () => {
    const error = new RepositoryError({
      repository: {
        method: CompaniesRepositoryMethods.SOFT_DELETE,
        name: RepositoriesNames.COMPANIES
      }
    });
    companiesRepository.softDelete.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(companiesRepository.softDelete).toHaveBeenCalledTimes(1);
  });

  it('should successfully delete company', async () => {
    const responseSuccess: DeleteCompanyUseCaseDTO.ResultSuccess = {
      company: {
        id: COMPANY_ID,
        deletedAt: COMPANY_DELETED_AT
      }
    };

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual(responseSuccess);
    expect(result.isFailure()).toBeFalsy();
    expect(result.isSuccess()).toBeTruthy();
    expect(companiesRepository.findById).toHaveBeenCalledTimes(1);
    expect(companiesRepository.softDelete).toHaveBeenCalledTimes(1);
  });
});

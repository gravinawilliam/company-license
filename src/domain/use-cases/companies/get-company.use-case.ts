import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdCompaniesRepository } from '@contracts/repositories/companies/find-by-id.companies-repository';

import { UseCase } from '@use-cases/_shared/use-case';

import { RepositoryError } from '@errors/_shared/repository.error';
import { CompanyNotFoundError } from '@errors/models/company/company-not-found-error';

import { Company } from '@models/company.model';

import { Either, failure, success } from '@shared/utils/either.util';

export class GetCompanyUseCase extends UseCase<
  GetCompanyUseCaseDTO.Parameters,
  GetCompanyUseCaseDTO.ResultFailure,
  GetCompanyUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly companiesRepository: IFindByIdCompaniesRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: GetCompanyUseCaseDTO.Parameters): GetCompanyUseCaseDTO.Result {
    const resultFind = await this.companiesRepository.findById({
      company: { id: parameters.company.id }
    });
    if (resultFind.isFailure()) return failure(resultFind.value);
    const { company } = resultFind.value;

    if (company === null) return failure(new CompanyNotFoundError({ company: { id: parameters.company.id } }));

    if (company.deletedAt !== undefined) {
      return failure(new CompanyNotFoundError({ company: { id: parameters.company.id } }));
    }

    return success({ company });
  }
}

export namespace GetCompanyUseCaseDTO {
  export type Parameters = Readonly<{
    company: Pick<Company, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | CompanyNotFoundError>;
  export type ResultSuccess = Readonly<{
    company: Company;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

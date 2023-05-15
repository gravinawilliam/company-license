import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdCompaniesRepository } from '@contracts/repositories/companies/find-by-id.companies-repository';
import { ISoftDeleteCompaniesRepository } from '@contracts/repositories/companies/soft-delete.companies-repository';

import { UseCase } from '@use-cases/_shared/use-case';

import { RepositoryError } from '@errors/_shared/repository.error';
import { CompanyNotFoundError } from '@errors/models/company/company-not-found-error';

import { Company } from '@models/company.model';

import { Either, failure, success } from '@shared/utils/either.util';

export class DeleteCompanyUseCase extends UseCase<
  DeleteCompanyUseCaseDTO.Parameters,
  DeleteCompanyUseCaseDTO.ResultFailure,
  DeleteCompanyUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly companiesRepository: IFindByIdCompaniesRepository & ISoftDeleteCompaniesRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: DeleteCompanyUseCaseDTO.Parameters): DeleteCompanyUseCaseDTO.Result {
    const resultFind = await this.companiesRepository.findById({
      company: { id: parameters.company.id }
    });
    if (resultFind.isFailure()) return failure(resultFind.value);

    const { company } = resultFind.value;
    if (company === null) return failure(new CompanyNotFoundError({ company: { id: parameters.company.id } }));

    const resultSoftDelete = await this.companiesRepository.softDelete({
      company: { id: parameters.company.id }
    });
    if (resultSoftDelete.isFailure()) return failure(resultSoftDelete.value);

    return success({ company: resultSoftDelete.value.company });
  }
}

export namespace DeleteCompanyUseCaseDTO {
  export type Parameters = Readonly<{
    company: Pick<Company, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | CompanyNotFoundError>;
  export type ResultSuccess = Readonly<{
    company: Required<Pick<Company, 'id' | 'deletedAt'>>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

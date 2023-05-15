import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindAllCompaniesRepository } from '@contracts/repositories/companies/find-all.companies-repository';

import { UseCase } from '@use-cases/_shared/use-case';

import { RepositoryError } from '@errors/_shared/repository.error';

import { Company } from '@models/company.model';

import { Either, failure, success } from '@shared/utils/either.util';

export class ListCompaniesUseCase extends UseCase<
  ListCompaniesUseCaseDTO.Parameters,
  ListCompaniesUseCaseDTO.ResultFailure,
  ListCompaniesUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly companiesRepository: IFindAllCompaniesRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(_parameters: ListCompaniesUseCaseDTO.Parameters): ListCompaniesUseCaseDTO.Result {
    const resultFindAll = await this.companiesRepository.findAll();
    if (resultFindAll.isFailure()) return failure(resultFindAll.value);
    const { companies } = resultFindAll.value;

    return success({ companies });
  }
}

export namespace ListCompaniesUseCaseDTO {
  export type Parameters = Readonly<undefined>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    companies: Company[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

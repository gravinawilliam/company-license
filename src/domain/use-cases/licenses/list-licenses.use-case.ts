import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindAllLicensesRepository } from '@contracts/repositories/license/find-all.licenses-repository';

import { UseCase } from '@use-cases/_shared/use-case';

import { RepositoryError } from '@errors/_shared/repository.error';

import { License } from '@models/license.model';

import { Either, failure, success } from '@shared/utils/either.util';

export class ListLicensesUseCase extends UseCase<
  ListLicensesUseCaseDTO.Parameters,
  ListLicensesUseCaseDTO.ResultFailure,
  ListLicensesUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly licensesRepository: IFindAllLicensesRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(_parameters: ListLicensesUseCaseDTO.Parameters): ListLicensesUseCaseDTO.Result {
    const resultFindAll = await this.licensesRepository.findAll();
    if (resultFindAll.isFailure()) return failure(resultFindAll.value);
    const { licenses } = resultFindAll.value;

    return success({ licenses });
  }
}

export namespace ListLicensesUseCaseDTO {
  export type Parameters = Readonly<undefined>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    licenses: License[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

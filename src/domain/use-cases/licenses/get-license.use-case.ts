import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdLicensesRepository } from '@contracts/repositories/license/find-by-id.licenses-repository';

import { UseCase } from '@use-cases/_shared/use-case';

import { RepositoryError } from '@errors/_shared/repository.error';
import { LicenseNotFoundError } from '@errors/models/license/license-not-found-error';

import { License } from '@models/license.model';

import { Either, failure, success } from '@shared/utils/either.util';

export class GetLicenseUseCase extends UseCase<
  GetLicenseUseCaseDTO.Parameters,
  GetLicenseUseCaseDTO.ResultFailure,
  GetLicenseUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly licensesRepository: IFindByIdLicensesRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: GetLicenseUseCaseDTO.Parameters): GetLicenseUseCaseDTO.Result {
    const resultFind = await this.licensesRepository.findById({
      license: { id: parameters.license.id }
    });
    if (resultFind.isFailure()) return failure(resultFind.value);
    const { license } = resultFind.value;

    if (license === null) return failure(new LicenseNotFoundError({ license: { id: parameters.license.id } }));

    if (license.deletedAt !== undefined) {
      return failure(new LicenseNotFoundError({ license: { id: parameters.license.id } }));
    }

    return success({ license });
  }
}

export namespace GetLicenseUseCaseDTO {
  export type Parameters = Readonly<{
    license: Pick<License, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | LicenseNotFoundError>;
  export type ResultSuccess = Readonly<{
    license: License;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

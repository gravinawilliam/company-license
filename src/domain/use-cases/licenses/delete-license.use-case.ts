import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdLicensesRepository } from '@contracts/repositories/license/find-by-id.licenses-repository';
import { ISoftDeleteLicensesRepository } from '@contracts/repositories/license/soft-delete.licenses-repository';

import { UseCase } from '@use-cases/_shared/use-case';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { LicenseNotFoundError } from '@errors/models/license/license-not-found-error';

import { License } from '@models/license.model';

import { Either, failure, success } from '@shared/utils/either.util';

export class DeleteLicenseUseCase extends UseCase<
  DeleteLicenseUseCaseDTO.Parameters,
  DeleteLicenseUseCaseDTO.ResultFailure,
  DeleteLicenseUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly licensesRepository: IFindByIdLicensesRepository & ISoftDeleteLicensesRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: DeleteLicenseUseCaseDTO.Parameters): DeleteLicenseUseCaseDTO.Result {
    const resultFind = await this.licensesRepository.findById({
      license: { id: parameters.license.id }
    });
    if (resultFind.isFailure()) return failure(resultFind.value);
    const { license } = resultFind.value;
    if (license === null) return failure(new LicenseNotFoundError({ license: { id: parameters.license.id } }));
    if (license.deletedAt !== undefined) {
      return failure(new LicenseNotFoundError({ license: { id: parameters.license.id } }));
    }

    const resultSoftDelete = await this.licensesRepository.softDelete({
      license: { id: parameters.license.id }
    });
    if (resultSoftDelete.isFailure()) return failure(resultSoftDelete.value);

    return success({ license: resultSoftDelete.value.license });
  }
}

export namespace DeleteLicenseUseCaseDTO {
  export type Parameters = Readonly<{
    license: Pick<License, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError | LicenseNotFoundError>;
  export type ResultSuccess = Readonly<{
    license: Required<Pick<License, 'id' | 'deletedAt'>>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

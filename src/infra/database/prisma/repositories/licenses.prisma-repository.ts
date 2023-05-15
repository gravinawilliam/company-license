import { PrismaClient } from '@prisma/client';

import { IGenerateIdCryptoProvider } from '@contracts/providers/crypto/generate-id.crypto-provider';
import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import {
  IFindAllLicensesRepository,
  FindAllLicensesRepositoryDTO
} from '@contracts/repositories/license/find-all.licenses-repository';
import {
  IFindByIdLicensesRepository,
  FindByIdLicensesRepositoryDTO
} from '@contracts/repositories/license/find-by-id.licenses-repository';
import {
  FindByLicenseNumberLicensesRepositoryDTO,
  IFindByLicenseNumberLicensesRepository
} from '@contracts/repositories/license/find-by-license-number.licenses-repository';
import {
  ISaveLicensesRepository,
  SaveLicensesRepositoryDTO
} from '@contracts/repositories/license/save.licenses-repository';
import {
  ISoftDeleteLicensesRepository,
  SoftDeleteLicensesRepositoryDTO
} from '@contracts/repositories/license/soft-delete.licenses-repository';
import {
  IUpdateLicensesRepository,
  UpdateLicensesRepositoryDTO
} from '@contracts/repositories/license/update.licenses-repository';

import { LicensesRepositoryMethods, RepositoriesNames, RepositoryError } from '@errors/_shared/repository.error';

import { License } from '@models/license.model';

import { failure, success } from '@shared/utils/either.util';

export class LicensesPrismaRepository
  implements
    IFindAllLicensesRepository,
    IFindByLicenseNumberLicensesRepository,
    IFindByIdLicensesRepository,
    ISaveLicensesRepository,
    ISoftDeleteLicensesRepository,
    IUpdateLicensesRepository
{
  constructor(
    private readonly loggerProvider: ISendLogErrorLoggerProvider,
    private readonly cryptoProvider: IGenerateIdCryptoProvider,
    private readonly prisma: PrismaClient
  ) {}

  public async findByLicenseNumber(
    parameters: FindByLicenseNumberLicensesRepositoryDTO.Parameters
  ): FindByLicenseNumberLicensesRepositoryDTO.Result {
    try {
      const result = await this.prisma.licenseTable.findFirst({
        where: {
          deletedAt: null,
          licenseNumber: parameters.license.licenseNumber
        }
      });

      if (result === null) return success({ license: null });

      return success({
        license: {
          company: {
            id: result.companyId
          },
          emissionDate: result.emissionDate,
          environmentalAgency: result.environmentalAgency,
          expirationDate: result.expirationDate,
          id: result.id,
          licenseNumber: result.licenseNumber
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.LICENSES,
          method: LicensesRepositoryMethods.FIND_ALL,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async findAll(): FindAllLicensesRepositoryDTO.Result {
    try {
      const result = await this.prisma.licenseTable.findMany({
        where: {
          deletedAt: null
        }
      });
      return success({
        licenses: result.map(
          license =>
            ({
              company: {
                id: license.companyId
              },
              emissionDate: license.emissionDate,
              environmentalAgency: license.environmentalAgency,
              expirationDate: license.expirationDate,
              id: license.id,
              licenseNumber: license.licenseNumber
            } as License)
        )
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.LICENSES,
          method: LicensesRepositoryMethods.FIND_ALL,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async findById(parameters: FindByIdLicensesRepositoryDTO.Parameters): FindByIdLicensesRepositoryDTO.Result {
    try {
      const result = await this.prisma.licenseTable.findFirst({
        where: { id: parameters.license.id, deletedAt: null }
      });
      if (result === null) return success({ license: null });

      return success({
        license: {
          company: {
            id: result.companyId
          },
          emissionDate: result.emissionDate,
          environmentalAgency: result.environmentalAgency,
          expirationDate: result.expirationDate,
          id: result.id,
          licenseNumber: result.licenseNumber
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.LICENSES,
          method: LicensesRepositoryMethods.FIND_BY_ID,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async save(parameters: SaveLicensesRepositoryDTO.Parameters): SaveLicensesRepositoryDTO.Result {
    try {
      const resultUuidProvider = this.cryptoProvider.generateId();
      if (resultUuidProvider.isFailure()) return failure(resultUuidProvider.value);
      const { id } = resultUuidProvider.value;

      await this.prisma.licenseTable.create({
        data: {
          id: id,
          companyId: parameters.license.company.id,
          emissionDate: parameters.license.emissionDate,
          environmentalAgency: parameters.license.environmentalAgency,
          expirationDate: parameters.license.expirationDate,
          licenseNumber: parameters.license.licenseNumber
        },
        select: {
          id: true
        }
      });

      return success({ license: { id } });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.LICENSES,
          method: LicensesRepositoryMethods.SAVE,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async softDelete(
    parameters: SoftDeleteLicensesRepositoryDTO.Parameters
  ): SoftDeleteLicensesRepositoryDTO.Result {
    try {
      const deletedAt = new Date();
      await this.prisma.licenseTable.update({
        where: { id: parameters.license.id },
        data: { deletedAt }
      });

      return success({ license: { id: parameters.license.id, deletedAt } });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.LICENSES,
          method: LicensesRepositoryMethods.SOFT_DELETE,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async update(parameters: UpdateLicensesRepositoryDTO.Parameters): UpdateLicensesRepositoryDTO.Result {
    try {
      const result = await this.prisma.licenseTable.update({
        where: { id: parameters.license.id },
        data: {
          emissionDate: parameters.license.emissionDate,
          environmentalAgency: parameters.license.environmentalAgency,
          licenseNumber: parameters.license.licenseNumber,
          expirationDate: parameters.license.expirationDate
        }
      });

      return success({
        updatedLicense: {
          company: {
            id: result.companyId
          },
          emissionDate: result.emissionDate,
          environmentalAgency: result.environmentalAgency,
          expirationDate: result.expirationDate,
          id: result.id,
          licenseNumber: result.licenseNumber
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.LICENSES,
          method: LicensesRepositoryMethods.UPDATE,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }
}

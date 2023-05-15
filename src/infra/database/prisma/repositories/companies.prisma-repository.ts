import { PrismaClient } from '@prisma/client';

import { IGenerateIdCryptoProvider } from '@contracts/providers/crypto/generate-id.crypto-provider';
import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import {
  FindAllCompaniesRepositoryDTO,
  IFindAllCompaniesRepository
} from '@contracts/repositories/companies/find-all.companies-repository';
import {
  FindByCNPJCompaniesRepositoryDTO,
  IFindByCNPJCompaniesRepository
} from '@contracts/repositories/companies/find-by-cnpj.companies-repository';
import {
  FindByIdCompaniesRepositoryDTO,
  IFindByIdCompaniesRepository
} from '@contracts/repositories/companies/find-by-id.companies-repository';
import {
  ISaveCompaniesRepository,
  SaveCompaniesRepositoryDTO
} from '@contracts/repositories/companies/save.companies-repository';
import {
  ISoftDeleteCompaniesRepository,
  SoftDeleteCompaniesRepositoryDTO
} from '@contracts/repositories/companies/soft-delete.companies-repository';
import {
  IUpdateCompaniesRepository,
  UpdateCompaniesRepositoryDTO
} from '@contracts/repositories/companies/update.companies-repository';

import { CompaniesRepositoryMethods, RepositoriesNames, RepositoryError } from '@errors/_shared/repository.error';

import { Company } from '@models/company.model';

import { CNPJ } from '@value-objects/cnpj.value-object';

import { failure, success } from '@shared/utils/either.util';

export class CompaniesPrismaRepository
  implements
    IFindAllCompaniesRepository,
    IFindByCNPJCompaniesRepository,
    IFindByIdCompaniesRepository,
    ISaveCompaniesRepository,
    ISoftDeleteCompaniesRepository,
    IUpdateCompaniesRepository
{
  constructor(
    private readonly loggerProvider: ISendLogErrorLoggerProvider,
    private readonly cryptoProvider: IGenerateIdCryptoProvider,
    private readonly prisma: PrismaClient
  ) {}

  public async findAll(): FindAllCompaniesRepositoryDTO.Result {
    try {
      const result = await this.prisma.companyTable.findMany({
        include: {
          companyAddress: true
        },
        where: {
          deletedAt: null
        }
      });
      return success({
        companies: result.map(
          company =>
            ({
              cnpj: new CNPJ({
                cnpj: company.cnpj
              }),
              corporateName: company.corporateName,
              id: company.id,
              address: {
                city: company.companyAddress?.city,
                complement: company.companyAddress?.complement,
                neighborhood: company.companyAddress?.neighborhood,
                state: company.companyAddress?.state,
                street: company.companyAddress?.street,
                zipCode: company.companyAddress?.zipCode
              }
            } as Company)
        )
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.COMPANIES,
          method: CompaniesRepositoryMethods.FIND_ALL,
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

  public async findByCNPJ(
    parameters: FindByCNPJCompaniesRepositoryDTO.Parameters
  ): FindByCNPJCompaniesRepositoryDTO.Result {
    try {
      const result = await this.prisma.companyTable.findFirst({
        where: { cnpj: parameters.cnpj.value, deletedAt: undefined }
      });
      return success({ company: result });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.COMPANIES,
          method: CompaniesRepositoryMethods.FIND_BY_CNPJ,
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

  public async findById(parameters: FindByIdCompaniesRepositoryDTO.Parameters): FindByIdCompaniesRepositoryDTO.Result {
    try {
      const company = await this.prisma.companyTable.findFirst({
        where: { id: parameters.company.id, deletedAt: null },
        include: {
          companyAddress: true
        }
      });
      if (company === null) return success({ company: null });

      return success({
        company: {
          cnpj: new CNPJ({
            cnpj: company.cnpj
          }),
          corporateName: company.corporateName,
          id: company.id,
          deletedAt: undefined,
          address: {
            city: company.companyAddress === null ? '' : company.companyAddress.city,
            complement: company.companyAddress === null ? '' : company.companyAddress.complement,
            neighborhood: company.companyAddress === null ? '' : company.companyAddress.neighborhood,
            state: company.companyAddress === null ? '' : company.companyAddress.state,
            street: company.companyAddress === null ? '' : company.companyAddress.street,
            zipCode: company.companyAddress === null ? '' : company.companyAddress.zipCode
          }
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.COMPANIES,
          method: CompaniesRepositoryMethods.FIND_BY_ID,
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

  public async save(parameters: SaveCompaniesRepositoryDTO.Parameters): SaveCompaniesRepositoryDTO.Result {
    try {
      const resultUuidProvider = this.cryptoProvider.generateId();
      if (resultUuidProvider.isFailure()) return failure(resultUuidProvider.value);
      const { id } = resultUuidProvider.value;

      await this.prisma.companyTable.create({
        data: {
          id: id,
          cnpj: parameters.company.cnpj.value,
          corporateName: parameters.company.corporateName,
          companyAddress: {
            create: {
              city: parameters.company.address.city,
              complement: parameters.company.address.complement,
              neighborhood: parameters.company.address.neighborhood,
              state: parameters.company.address.state,
              street: parameters.company.address.street,
              zipCode: parameters.company.address.zipCode,
              id: id
            }
          }
        },
        select: {
          id: true
        }
      });

      return success({ company: { id } });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.COMPANIES,
          method: CompaniesRepositoryMethods.SAVE,
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
    parameters: SoftDeleteCompaniesRepositoryDTO.Parameters
  ): SoftDeleteCompaniesRepositoryDTO.Result {
    try {
      const deletedAt = new Date();
      await this.prisma.companyTable.update({
        where: { id: parameters.company.id },
        data: { deletedAt }
      });

      return success({ company: { id: parameters.company.id, deletedAt } });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.COMPANIES,
          method: CompaniesRepositoryMethods.SOFT_DELETE,
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

  public async update(parameters: UpdateCompaniesRepositoryDTO.Parameters): UpdateCompaniesRepositoryDTO.Result {
    try {
      const result = await this.prisma.companyTable.update({
        where: { id: parameters.company.id },
        include: {
          companyAddress: true
        },
        data: {
          corporateName: parameters.company.corporateName,
          companyAddress: {
            update: {
              city: parameters.company.address.city,
              complement: parameters.company.address.complement,
              neighborhood: parameters.company.address.neighborhood,
              state: parameters.company.address.state,
              street: parameters.company.address.street,
              zipCode: parameters.company.address.zipCode
            }
          }
        }
      });

      return success({
        updatedCompany: {
          address: {
            city: result.companyAddress === null ? '' : result.companyAddress.city,
            complement: result.companyAddress === null ? '' : result.companyAddress.complement,
            neighborhood: result.companyAddress === null ? '' : result.companyAddress.neighborhood,
            state: result.companyAddress === null ? '' : result.companyAddress.state,
            street: result.companyAddress === null ? '' : result.companyAddress.street,
            zipCode: result.companyAddress === null ? '' : result.companyAddress.zipCode
          },
          cnpj: new CNPJ({
            cnpj: result.cnpj
          }),
          corporateName: result.corporateName,
          id: result.id
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoriesNames.COMPANIES,
          method: CompaniesRepositoryMethods.UPDATE,
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

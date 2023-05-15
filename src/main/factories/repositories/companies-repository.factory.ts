import { IFindAllCompaniesRepository } from '@contracts/repositories/companies/find-all.companies-repository';
import { IFindByCNPJCompaniesRepository } from '@contracts/repositories/companies/find-by-cnpj.companies-repository';
import { IFindByIdCompaniesRepository } from '@contracts/repositories/companies/find-by-id.companies-repository';
import { ISaveCompaniesRepository } from '@contracts/repositories/companies/save.companies-repository';
import { ISoftDeleteCompaniesRepository } from '@contracts/repositories/companies/soft-delete.companies-repository';
import { IUpdateCompaniesRepository } from '@contracts/repositories/companies/update.companies-repository';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { CompaniesPrismaRepository } from '@infrastructure/database/prisma/repositories/companies.prisma-repository';

import { makeCryptoProvider } from '@factories/providers/crypto-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeCompaniesRepository = (): IFindAllCompaniesRepository &
  IFindByCNPJCompaniesRepository &
  IFindByIdCompaniesRepository &
  ISaveCompaniesRepository &
  ISoftDeleteCompaniesRepository &
  IUpdateCompaniesRepository => new CompaniesPrismaRepository(makeLoggerProvider(), makeCryptoProvider(), prisma);

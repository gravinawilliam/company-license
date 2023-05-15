import { IFindAllLicensesRepository } from '@contracts/repositories/license/find-all.licenses-repository';
import { IFindByIdLicensesRepository } from '@contracts/repositories/license/find-by-id.licenses-repository';
import { IFindByLicenseNumberLicensesRepository } from '@contracts/repositories/license/find-by-license-number.licenses-repository';
import { ISaveLicensesRepository } from '@contracts/repositories/license/save.licenses-repository';
import { ISoftDeleteLicensesRepository } from '@contracts/repositories/license/soft-delete.licenses-repository';
import { IUpdateLicensesRepository } from '@contracts/repositories/license/update.licenses-repository';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { LicensesPrismaRepository } from '@infrastructure/database/prisma/repositories/licenses.prisma-repository';

import { makeCryptoProvider } from '@factories/providers/crypto-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeLicensesRepository = (): IFindAllLicensesRepository &
  IFindByLicenseNumberLicensesRepository &
  IFindByIdLicensesRepository &
  ISaveLicensesRepository &
  ISoftDeleteLicensesRepository &
  IUpdateLicensesRepository => new LicensesPrismaRepository(makeLoggerProvider(), makeCryptoProvider(), prisma);

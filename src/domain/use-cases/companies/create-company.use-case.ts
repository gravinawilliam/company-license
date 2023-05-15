import { IGetZipCodeDataAddressProvider } from '@contracts/providers/address/get-zip-code-data.address-provider';
import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByCNPJCompaniesRepository } from '@contracts/repositories/companies/find-by-cnpj.companies-repository';
import { ISaveCompaniesRepository } from '@contracts/repositories/companies/save.companies-repository';

import { UseCase } from '@use-cases/_shared/use-case';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import {
  InvalidCompanyAddressError,
  InvalidCompanyAddressMotive
} from '@errors/models/company/invalid-company-address.error';
import { InvalidCorporateNameError } from '@errors/models/company/invalid-corporate-name.error';
import { CNPJAlreadyExistsError } from '@errors/value-objects/cnpj/cnpj-already-exists.error';
import { InvalidCNPJError } from '@errors/value-objects/cnpj/invalid-cnpj.error';

import { Company } from '@models/company.model';

import { CNPJ } from '@value-objects/cnpj.value-object';

import { Either, failure, success } from '@shared/utils/either.util';

export class CreateCompanyUseCase extends UseCase<
  CreateCompanyUseCaseDTO.Parameters,
  CreateCompanyUseCaseDTO.ResultFailure,
  CreateCompanyUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly addressProvider: IGetZipCodeDataAddressProvider,
    private readonly companiesRepository: IFindByCNPJCompaniesRepository & ISaveCompaniesRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: CreateCompanyUseCaseDTO.Parameters): CreateCompanyUseCaseDTO.Result {
    const resultValidateCnpj = CNPJ.validate({ cnpj: parameters.companyInfo.cnpj });
    if (resultValidateCnpj.isFailure()) return failure(resultValidateCnpj.value);
    const { validatedCNPJ } = resultValidateCnpj.value;

    const resultValidateCorporateName = Company.validateCorporateName({
      corporateName: parameters.companyInfo.corporateName
    });
    if (resultValidateCorporateName.isFailure()) return failure(resultValidateCorporateName.value);
    const { validatedCorporateName } = resultValidateCorporateName.value;

    const resultValidateAddress = Company.validateAddress({
      city: parameters.companyInfo.address.city,
      complement: parameters.companyInfo.address.complement,
      neighborhood: parameters.companyInfo.address.neighborhood,
      state: parameters.companyInfo.address.state,
      street: parameters.companyInfo.address.street,
      zipCode: parameters.companyInfo.address.zipCode
    });
    if (resultValidateAddress.isFailure()) return failure(resultValidateAddress.value);
    const { validatedAddress } = resultValidateAddress.value;

    const resultGetZipCodeData = await this.addressProvider.getZipCodeData({
      zipCode: parameters.companyInfo.address.zipCode
    });
    if (resultGetZipCodeData.isFailure()) return failure(resultGetZipCodeData.value);
    if (resultGetZipCodeData.value.address === null) {
      return failure(
        new InvalidCompanyAddressError({
          motive: InvalidCompanyAddressMotive.ZIP_CODE_NOT_FOUND
        })
      );
    }

    const resultFindCompanyByCNPJ = await this.companiesRepository.findByCNPJ({ cnpj: validatedCNPJ });
    if (resultFindCompanyByCNPJ.isFailure()) return failure(resultFindCompanyByCNPJ.value);
    if (resultFindCompanyByCNPJ.value.company !== null) {
      return failure(new CNPJAlreadyExistsError({ cnpj: validatedCNPJ }));
    }

    const resultSaveCompany = await this.companiesRepository.save({
      company: {
        cnpj: validatedCNPJ,
        corporateName: validatedCorporateName,
        address: validatedAddress
      }
    });
    if (resultSaveCompany.isFailure()) return failure(resultSaveCompany.value);
    const { company: savedCompany } = resultSaveCompany.value;

    return success({
      company: {
        id: savedCompany.id,
        address: validatedAddress,
        cnpj: validatedCNPJ,
        corporateName: validatedCorporateName
      }
    });
  }
}

export namespace CreateCompanyUseCaseDTO {
  export type Parameters = Readonly<{
    companyInfo: {
      corporateName: string;
      cnpj: string;
      address: {
        zipCode: string;
        city: string;
        state: string;
        street: string;
        neighborhood: string;
        complement: string;
      };
    };
  }>;

  export type ResultFailure = Readonly<
    | InvalidCNPJError
    | InvalidCorporateNameError
    | InvalidCompanyAddressError
    | CNPJAlreadyExistsError
    | RepositoryError
    | ProviderError
  >;
  export type ResultSuccess = Readonly<{
    company: Company;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

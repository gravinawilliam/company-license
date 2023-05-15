import { IGetZipCodeDataAddressProvider } from '@contracts/providers/address/get-zip-code-data.address-provider';
import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdCompaniesRepository } from '@contracts/repositories/companies/find-by-id.companies-repository';
import { IUpdateCompaniesRepository } from '@contracts/repositories/companies/update.companies-repository';

import { UseCase } from '@use-cases/_shared/use-case';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { CompanyNotFoundError } from '@errors/models/company/company-not-found-error';
import {
  InvalidCompanyAddressError,
  InvalidCompanyAddressMotive
} from '@errors/models/company/invalid-company-address.error';
import { InvalidCorporateNameError } from '@errors/models/company/invalid-corporate-name.error';

import { Company, CompanyAddress } from '@models/company.model';

import { Either, failure, success } from '@shared/utils/either.util';

export class UpdateCompanyUseCase extends UseCase<
  UpdateCompanyUseCaseDTO.Parameters,
  UpdateCompanyUseCaseDTO.ResultFailure,
  UpdateCompanyUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly companiesRepository: IFindByIdCompaniesRepository & IUpdateCompaniesRepository,
    private readonly addressProvider: IGetZipCodeDataAddressProvider
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: UpdateCompanyUseCaseDTO.Parameters): UpdateCompanyUseCaseDTO.Result {
    const resultFindCompany = await this.companiesRepository.findById({
      company: { id: parameters.company.id }
    });
    if (resultFindCompany.isFailure()) return failure(resultFindCompany.value);
    const { company } = resultFindCompany.value;

    if (company === null) return failure(new CompanyNotFoundError({ company: { id: parameters.company.id } }));

    let corporateName = parameters.companyUpdate.corporateName ?? company.corporateName;
    if (parameters.companyUpdate.corporateName !== undefined) {
      const resultValidateCorporateName = Company.validateCorporateName({
        corporateName: parameters.companyUpdate.corporateName
      });
      if (resultValidateCorporateName.isFailure()) return failure(resultValidateCorporateName.value);
      const { validatedCorporateName } = resultValidateCorporateName.value;
      corporateName = validatedCorporateName;
    }

    const resultValidateAddress = await this.validateAddress({
      company,
      newAddress: parameters.companyUpdate.address
    });
    if (resultValidateAddress.isFailure()) return failure(resultValidateAddress.value);
    const { validatedAddress } = resultValidateAddress.value;

    const resultUpdateCompany = await this.companiesRepository.update({
      company: {
        address: validatedAddress,
        corporateName,
        id: company.id
      }
    });
    if (resultUpdateCompany.isFailure()) return failure(resultUpdateCompany.value);
    const { updatedCompany } = resultUpdateCompany.value;

    return success({ updatedCompany });
  }

  private async validateAddress(parameters: {
    company: Pick<Company, 'address'>;
    newAddress: {
      zipCode?: string;
      city?: string;
      state?: string;
      street?: string;
      neighborhood?: string;
      complement?: string;
    };
  }): Promise<Either<InvalidCompanyAddressError | ProviderError, { validatedAddress: CompanyAddress }>> {
    const resultValidateAddress = Company.validateAddress({
      city: parameters.newAddress.city ?? parameters.company.address.city,
      complement: parameters.newAddress.complement ?? parameters.company.address.complement,
      neighborhood: parameters.newAddress.neighborhood ?? parameters.company.address.neighborhood,
      state: parameters.newAddress.state ?? parameters.company.address.state,
      street: parameters.newAddress.street ?? parameters.company.address.street,
      zipCode: parameters.newAddress.zipCode ?? parameters.company.address.zipCode
    });
    if (resultValidateAddress.isFailure()) return failure(resultValidateAddress.value);
    const { validatedAddress } = resultValidateAddress.value;

    if (parameters.newAddress.zipCode !== undefined) {
      const resultGetZipCodeData = await this.addressProvider.getZipCodeData({
        zipCode: parameters.newAddress.zipCode
      });
      if (resultGetZipCodeData.isFailure()) return failure(resultGetZipCodeData.value);
      if (resultGetZipCodeData.value.address === null) {
        return failure(
          new InvalidCompanyAddressError({
            motive: InvalidCompanyAddressMotive.ZIP_CODE_NOT_FOUND
          })
        );
      }
    }

    return success({ validatedAddress });
  }
}

export namespace UpdateCompanyUseCaseDTO {
  export type Parameters = Readonly<{
    company: Pick<Company, 'id'>;
    companyUpdate: {
      corporateName?: string;
      address: {
        zipCode?: string;
        city?: string;
        state?: string;
        street?: string;
        neighborhood?: string;
        complement?: string;
      };
    };
  }>;

  export type ResultFailure = Readonly<
    RepositoryError | ProviderError | CompanyNotFoundError | InvalidCorporateNameError | InvalidCompanyAddressError
  >;
  export type ResultSuccess = Readonly<{
    updatedCompany: Company;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

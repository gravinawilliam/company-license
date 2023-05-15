import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyPrivateKeyUseCaseDTO } from '@use-cases/authentication/verify-private-key.use-case';
import { UpdateCompanyUseCaseDTO } from '@use-cases/companies/update-company.use-case';

import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class UpdateCompanyController extends Controller<
  UpdateCompanyControllerDTO.Parameters,
  UpdateCompanyControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyPrivateKeyUseCase: UseCase<
      VerifyPrivateKeyUseCaseDTO.Parameters,
      VerifyPrivateKeyUseCaseDTO.ResultFailure,
      VerifyPrivateKeyUseCaseDTO.ResultSuccess
    >,
    private readonly updateCompanyUseCase: UseCase<
      UpdateCompanyUseCaseDTO.Parameters,
      UpdateCompanyUseCaseDTO.ResultFailure,
      UpdateCompanyUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: UpdateCompanyControllerDTO.Parameters): UpdateCompanyControllerDTO.Result {
    const { body, headers, params } = parameters;

    const resultVerifyPrivateKey = await this.verifyPrivateKeyUseCase.execute({
      privateKey: headers['private-key']
    });
    if (resultVerifyPrivateKey.isFailure()) return failure(resultVerifyPrivateKey.value);

    const resultUpdateCompany = await this.updateCompanyUseCase.execute({
      company: { id: params.id },
      companyUpdate: {
        corporateName: body.company_update.corporate_name,
        address: {
          city: body.company_update.address.city,
          state: body.company_update.address.state,
          street: body.company_update.address.street,
          neighborhood: body.company_update.address.neighborhood,
          complement: body.company_update.address.complement,
          zipCode: body.company_update.address.zip_code
        }
      }
    });
    if (resultUpdateCompany.isFailure()) return failure(resultUpdateCompany.value);
    const { updatedCompany } = resultUpdateCompany.value;

    return success({
      data: {
        updated_company: {
          address: {
            city: updatedCompany.address.city,
            state: updatedCompany.address.state,
            street: updatedCompany.address.street,
            neighborhood: updatedCompany.address.neighborhood,
            complement: updatedCompany.address.complement,
            zip_code: updatedCompany.address.zipCode
          },
          cnpj: updatedCompany.cnpj.value,
          corporate_name: updatedCompany.corporateName,
          id: updatedCompany.id
        }
      },
      status: StatusSuccess.DONE
    });
  }
}

export namespace UpdateCompanyControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      {
        company_update: {
          corporate_name?: string;
          address: {
            zip_code?: string;
            city?: string;
            state?: string;
            street?: string;
            neighborhood?: string;
            complement?: string;
          };
        };
      },
      {
        ['private-key']: string;
      },
      {
        id: string;
      }
    >
  >;

  type ResultError = VerifyPrivateKeyUseCaseDTO.ResultFailure | UpdateCompanyUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      updated_company: {
        id: string;
        corporate_name: string;
        cnpj: string;
        address: {
          zip_code: string;
          city: string;
          state: string;
          street: string;
          neighborhood: string;
          complement: string;
        };
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

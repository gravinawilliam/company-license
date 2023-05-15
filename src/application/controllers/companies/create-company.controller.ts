import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyPrivateKeyUseCaseDTO } from '@use-cases/authentication/verify-private-key.use-case';
import { CreateCompanyUseCaseDTO } from '@use-cases/companies/create-company.use-case';

import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class CreateCompanyController extends Controller<
  CreateCompanyControllerDTO.Parameters,
  CreateCompanyControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyPrivateKeyUseCase: UseCase<
      VerifyPrivateKeyUseCaseDTO.Parameters,
      VerifyPrivateKeyUseCaseDTO.ResultFailure,
      VerifyPrivateKeyUseCaseDTO.ResultSuccess
    >,
    private readonly createCompanyUseCase: UseCase<
      CreateCompanyUseCaseDTO.Parameters,
      CreateCompanyUseCaseDTO.ResultFailure,
      CreateCompanyUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: CreateCompanyControllerDTO.Parameters): CreateCompanyControllerDTO.Result {
    const { body, headers } = parameters;

    const resultVerifyPrivateKey = await this.verifyPrivateKeyUseCase.execute({
      privateKey: headers['private-key']
    });
    if (resultVerifyPrivateKey.isFailure()) return failure(resultVerifyPrivateKey.value);

    const resultCreateCompany = await this.createCompanyUseCase.execute({
      companyInfo: {
        corporateName: body.company_info.corporate_name,
        cnpj: body.company_info.cnpj,
        address: {
          city: body.company_info.address.city,
          state: body.company_info.address.state,
          street: body.company_info.address.street,
          neighborhood: body.company_info.address.neighborhood,
          complement: body.company_info.address.complement,
          zipCode: body.company_info.address.zip_code
        }
      }
    });
    if (resultCreateCompany.isFailure()) return failure(resultCreateCompany.value);
    const { company } = resultCreateCompany.value;

    return success({
      data: {
        company_created: {
          address: {
            city: company.address.city,
            state: company.address.state,
            street: company.address.street,
            neighborhood: company.address.neighborhood,
            complement: company.address.complement,
            zip_code: company.address.zipCode
          },
          cnpj: company.cnpj.value,
          corporate_name: company.corporateName,
          id: company.id
        }
      },
      status: StatusSuccess.CREATED
    });
  }
}

export namespace CreateCompanyControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      {
        company_info: {
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
      },
      {
        ['private-key']: string;
      },
      undefined
    >
  >;

  type ResultError = VerifyPrivateKeyUseCaseDTO.ResultFailure | CreateCompanyUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      company_created: {
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

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyPrivateKeyUseCaseDTO } from '@use-cases/authentication/verify-private-key.use-case';
import { GetCompanyUseCaseDTO } from '@use-cases/companies/get-company.use-case';

import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class GetCompanyController extends Controller<GetCompanyControllerDTO.Parameters, GetCompanyControllerDTO.Result> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyPrivateKeyUseCase: UseCase<
      VerifyPrivateKeyUseCaseDTO.Parameters,
      VerifyPrivateKeyUseCaseDTO.ResultFailure,
      VerifyPrivateKeyUseCaseDTO.ResultSuccess
    >,
    private readonly getCompanyUseCase: UseCase<
      GetCompanyUseCaseDTO.Parameters,
      GetCompanyUseCaseDTO.ResultFailure,
      GetCompanyUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: GetCompanyControllerDTO.Parameters): GetCompanyControllerDTO.Result {
    const { params, headers } = parameters;

    const resultVerifyPrivateKey = await this.verifyPrivateKeyUseCase.execute({
      privateKey: headers['private-key']
    });
    if (resultVerifyPrivateKey.isFailure()) return failure(resultVerifyPrivateKey.value);

    const resultGetCompany = await this.getCompanyUseCase.execute({
      company: { id: params.id }
    });
    if (resultGetCompany.isFailure()) return failure(resultGetCompany.value);
    const { company } = resultGetCompany.value;

    return success({
      data: {
        company: {
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
      status: StatusSuccess.DONE
    });
  }
}

export namespace GetCompanyControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      undefined,
      {
        ['private-key']: string;
      },
      {
        id: string;
      }
    >
  >;

  type ResultError = VerifyPrivateKeyUseCaseDTO.ResultFailure | GetCompanyUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      company: {
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

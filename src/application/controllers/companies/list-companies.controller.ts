import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyPrivateKeyUseCaseDTO } from '@use-cases/authentication/verify-private-key.use-case';
import { ListCompaniesUseCaseDTO } from '@use-cases/companies/list-companies.use-case';

import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class ListCompaniesController extends Controller<
  ListCompaniesControllerDTO.Parameters,
  ListCompaniesControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyPrivateKeyUseCase: UseCase<
      VerifyPrivateKeyUseCaseDTO.Parameters,
      VerifyPrivateKeyUseCaseDTO.ResultFailure,
      VerifyPrivateKeyUseCaseDTO.ResultSuccess
    >,
    private readonly listCompaniesUseCase: UseCase<
      ListCompaniesUseCaseDTO.Parameters,
      ListCompaniesUseCaseDTO.ResultFailure,
      ListCompaniesUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: ListCompaniesControllerDTO.Parameters): ListCompaniesControllerDTO.Result {
    const { headers } = parameters;

    const resultVerifyPrivateKey = await this.verifyPrivateKeyUseCase.execute({
      privateKey: headers['private-key']
    });
    if (resultVerifyPrivateKey.isFailure()) return failure(resultVerifyPrivateKey.value);

    const resultGetCompany = await this.listCompaniesUseCase.execute(undefined);
    if (resultGetCompany.isFailure()) return failure(resultGetCompany.value);
    const { companies } = resultGetCompany.value;

    return success({
      data: {
        companies: companies.map(company => ({
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
        }))
      },
      status: StatusSuccess.DONE
    });
  }
}

export namespace ListCompaniesControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      undefined,
      {
        ['private-key']: string;
      },
      undefined
    >
  >;

  type ResultError = VerifyPrivateKeyUseCaseDTO.ResultFailure | ListCompaniesUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      companies: {
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
      }[];
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

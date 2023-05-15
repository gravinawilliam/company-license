import { InvalidCNPJError, InvalidCNPJMotive } from '@errors/value-objects/cnpj/invalid-cnpj.error';

import { Either, failure, success } from '@shared/utils/either.util';

export class CNPJ {
  public value: string;

  constructor(parameters: { cnpj: string }) {
    this.value = parameters.cnpj;
  }

  public static validate(parameters: { cnpj: string }): Either<InvalidCNPJError, { validatedCNPJ: CNPJ }> {
    if (parameters.cnpj.length !== 14 && parameters.cnpj.length !== 18) {
      return failure(
        new InvalidCNPJError({
          cnpj: parameters.cnpj,
          motive: InvalidCNPJMotive.INVALID_FORMAT
        })
      );
    }

    const cnpjCleaned = parameters.cnpj.replaceAll(/[./-]/g, '');

    if (cnpjCleaned.length !== 14) {
      return failure(
        new InvalidCNPJError({
          cnpj: parameters.cnpj,
          motive: InvalidCNPJMotive.INVALID_FORMAT
        })
      );
    }

    const digit = (numbers: string): number => {
      let index = 2;

      const sum = [...numbers].reverse().reduce((buffer, number) => {
        buffer += Number(number) * index;
        index = index === 9 ? 2 : index + 1;
        return buffer;
      }, 0);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const module_ = sum % 11;

      return module_ < 2 ? 0 : 11 - module_;
    };

    let registration = cnpjCleaned.slice(0, 12);
    registration += digit(registration);
    registration += digit(registration);

    if (registration.slice(-2) !== cnpjCleaned.slice(-2)) {
      return failure(
        new InvalidCNPJError({
          cnpj: parameters.cnpj,
          motive: InvalidCNPJMotive.INVALID_FORMAT
        })
      );
    }

    return success({
      validatedCNPJ: new CNPJ({
        cnpj: cnpjCleaned
      })
    });
  }
}

import { StatusError } from '@errors/_shared/status-error';

export class InvalidPrivateKeyError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidPrivateKeyError';

  constructor() {
    this.name = 'InvalidPrivateKeyError';
    this.message = `Invalid private key.`;
    this.status = StatusError.INVALID;
  }
}

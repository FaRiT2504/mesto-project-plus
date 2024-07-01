import { ACCESS_ERROR } from '../constants';

class AccessError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ACCESS_ERROR;
  }
}

export default AccessError;

import { REQUEST_ERROR } from '../constants';

class RequestError extends Error {
  public statusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = REQUEST_ERROR;
  }
}

export default RequestError;

import { NOT_FOUND_ERROR } from '../constants';

class NotFoundError extends Error {
  public statusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR;
  }
}

export default NotFoundError;

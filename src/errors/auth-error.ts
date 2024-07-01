import { AUTH_ERROR } from '../constants';

class AuthError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = AUTH_ERROR;
  }
}

export default AuthError;

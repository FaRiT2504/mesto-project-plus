import { NextFunction, Request, Response } from 'express';
import { SERVER_ERROR } from '../constants';

interface IError extends Error {
  statusCode: number;
}

const errorHandler = ((err: IError, req: Request, res: Response, next: NextFunction) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

export default errorHandler;

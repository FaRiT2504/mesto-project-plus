import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from '../constants';
import AuthError from '../errors/auth-error';

interface Payload extends Request {
  user?: string | JwtPayload;
}

export default (req: Payload, res: Response, next: NextFunction) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // отправим ошибку, если не получилось
    throw new AuthError('Необходима авторизация');
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new AuthError('Необходима авторизация');
  }
  req.user = payload;// записываем пейлоуд в объект запроса
  return next();
};

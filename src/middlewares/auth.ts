import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface Payload extends Request {
  user?: string | JwtPayload;
}

export default (req: Payload, res: Response, next: NextFunction) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;// записываем пейлоуд в объект запроса
  return next();
};

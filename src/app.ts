import mongoose from 'mongoose';
import express from 'express';
import { errors } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import { validationsCreateUser, validationsLogin } from './validations/users';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import auth from './middlewares/auth';

const { MONGO_URL = 'mongodb://localhost:27017/mestodb', PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(MONGO_URL);
app.use(requestLogger);
// роуты, не требующие авторизации,
app.post('/signin', validationsLogin, login);
app.post('/signup', validationsCreateUser, createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use(errorLogger); // подключаем логер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

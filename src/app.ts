import mongoose from 'mongoose';
import express, { NextFunction, Request, Response } from 'express';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

interface RequestCustom extends Request {
  user?: {
    _id: string;
  };
}
const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6678862a3ac2e05ef221bf49',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

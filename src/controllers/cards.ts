import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { REQUEST_SUCCESS } from '../constants';
import RequestError from '../errors/request-error';
import AccessError from '../errors/access-error';
import NotFoundError from '../errors/not-found-error';

interface RequestCustom extends Request {
  user?: {
    _id: string;
  };
}
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return next(error);
  }
};

export const deleteCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId).orFail(() => {
      throw new NotFoundError('Карточка пользователя не найдена');
    });
    if (req.user?._id !== card?.owner.toString()) {
      throw new AccessError('Можно удалять только свои карточки');
    }
    return res.send({ message: 'Карточка удалена' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new RequestError('Некорректные данные карты'));
    }
    return next(error);
  }
};
export const createCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;

    const card = Card.create({
      name,
      link,
      owner: req.user?._id,
    });
    return res.status(REQUEST_SUCCESS).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new RequestError('Некорректные данные карты'));
    }
    return next(error);
  }
};

export const likeCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) { return next(new NotFoundError('Карточка пользователя не найдена')); }
    return res.send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new RequestError('Некорректные данные карты'));
    }
    return next(error);
  }
};

export const dislikeCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user?._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) { return next(new NotFoundError('Карточка пользователя не найдена')); }
    return res.send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new RequestError('Некорректные данные карты'));
    }
    return next(error);
  }
};

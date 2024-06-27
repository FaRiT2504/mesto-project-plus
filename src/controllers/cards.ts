import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { REQUEST_SUCCESS } from '../constants';

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
    Card.findByIdAndDelete(req.params.cardId);
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    return next(err);
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
    return res.send(card);
  } catch (error) {
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

    return res.send(card);
  } catch (error) {
    return next(error);
  }
};

import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { REQUEST_SUCCESS } from '../constants';

interface RequestCustom extends Request {
  user?: {
    _id: string;
  };
}
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return next(error);
  }
};
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    return res.status(REQUEST_SUCCESS).send({ data: user });
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    await newUser.save();
    return res.status(REQUEST_SUCCESS).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true },
    );

    return res.status(REQUEST_SUCCESS).send({ data: updatedUser });
  } catch (err) {
    return next(err);
  }
};
export const updateAvatar = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    );

    return res.status(REQUEST_SUCCESS).send({ data: updatedUser });
  } catch (err) {
    return next(err);
  }
};

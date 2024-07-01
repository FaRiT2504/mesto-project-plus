import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user';
import { REQUEST_SUCCESS, SECRET_KEY } from '../constants';
import RequestError from '../errors/request-error';

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
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    // хешируем пароль
    const hashPassword = await bcrypt.hash(password, 11);
    const newUser = await User.create({
      name, about, avatar, email, password: hashPassword,
    });
    await newUser.save();
    return res.status(REQUEST_SUCCESS).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      password: newUser.password,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new RequestError('Переданы некорректные данные пользователя'));
    }
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
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new RequestError('Некорректные данные профиля'));
    }
    return next(error);
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
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return (new RequestError('Некорректные данные аватара профиля'));
    }
    return next(error);
  }
};

export const login = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      password,
    } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
    res.header('Authorization', token).send({ token });
  } catch (error) {
    next(error);
  }
};
export const getCurrentUser = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    return res.send(user);
  } catch (error) {
    return next(error);
  }
};

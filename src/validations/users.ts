import { celebrate, Joi } from 'celebrate';
import { avatarValidations } from '../constants';

export const validationsUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});
export const validationsUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(avatarValidations),
  }).unknown(true),
});

export const validationsUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

export const validationsCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(200).default('Исследователь'),
    email: Joi.string().required().email(),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').regex(avatarValidations),
    password: Joi.string().required(),
  }),
});

export const validationsLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

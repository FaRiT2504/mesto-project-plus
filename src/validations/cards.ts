import { celebrate, Joi } from 'celebrate';
import { avatarValidations } from '../constants';

export const validationsCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

export const validationsCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(avatarValidations).required(),
  }),
});

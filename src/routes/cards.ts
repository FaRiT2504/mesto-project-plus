import { Router } from 'express';
import {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
} from '../controllers/cards';
import {
  validationsCreateCard, validationsCard,
} from '../validations/cards';

const router = Router();
router.get('/', getCards);
router.post('/', validationsCreateCard, createCard);
router.put('/:cardId/likes', validationsCard, likeCard);
router.delete('/:cardId', validationsCard, deleteCard);
router.delete('/:cardId/likes', validationsCard, dislikeCard);

export default router;

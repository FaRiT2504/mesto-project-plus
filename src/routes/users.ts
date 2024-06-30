import { Router } from 'express';
// import {
//   celebrate, Joi,
// } from 'celebrate';
import {
  getUserById, getUsers, updateUser, updateAvatar, getCurrentUser,
} from '../controllers/users';
import {
  validationsUpdateAvatar, validationsUserById, validationsUpdateUser,
} from '../validations/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validationsUserById, getUserById);
// router.post('/', createUser);
router.patch('/me', validationsUpdateUser, updateUser);
router.patch('/me/avatar', validationsUpdateAvatar, updateAvatar);

export default router;

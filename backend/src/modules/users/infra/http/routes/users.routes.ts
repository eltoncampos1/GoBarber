import { Router } from 'express';
import multer from 'multer';

import ensureAuthenticated from '@modules/users/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import UsersControllers from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const userAvatarController = new UserAvatarController();
const upload = multer(uploadConfig);
const usersController = new UsersControllers();

usersRouter.post('/', usersController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;

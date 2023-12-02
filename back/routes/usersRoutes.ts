import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import { authenticate } from "../middlewares/auth.js";

const usersRouter = Router();
usersRouter.get('/user/:id', authenticate, UsersController.getUser);
usersRouter.get('/user', authenticate, UsersController.getUser);
usersRouter.get('/user/:id/chats', authenticate, UsersController.getUserChats);
usersRouter.patch('/user/:id', authenticate, UsersController.patchUser);
usersRouter.post('/user/avatar', authenticate, UsersController.uploadAvatar.single('avatar'), UsersController.createAvatar);
export default usersRouter;

import { Router } from "express";
import ChatsController from "../controllers/chatsController.js";
import { authenticate } from "../middlewares/auth.js";
import { authenticateChat } from "../middlewares/chatAuth.js";

const chatsRouter = Router();
chatsRouter.get('/chats', authenticate, ChatsController.getChats);
chatsRouter.get('/chat/:id', authenticate, authenticateChat, ChatsController.getChat);
chatsRouter.get('/chat/:id/messages', authenticate, authenticateChat, ChatsController.getChatMessages);
chatsRouter.get('/chat/:id/members', authenticate, authenticateChat, ChatsController.getChatMembers);
chatsRouter.post('/chat', authenticate, ChatsController.uploadAvatar.single('avatar'), ChatsController.createChat);
chatsRouter.post('/chat/join', authenticate,  ChatsController.joinChat);
export default chatsRouter;
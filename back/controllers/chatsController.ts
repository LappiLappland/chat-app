import bcrypt from "bcrypt";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { IncludeOptions } from "sequelize";
import { io } from "../app.js";
import ChatMember from "../models/chatMembers.model.js";
import ChatMessage from "../models/chatMessages.model.js";
import Chat from "../models/chats.model.js";
import User from "../models/users.model.js";
import { validateChat, ChatSchema } from "../schemas/chat.js";
import { BCRYPT_SALT } from "./authController.js";

export interface getChatParams {
  id: string
}

interface getChatQuery {
  withMessages: string
}

interface getChatsQuery {
  userId: number,
}

interface createChatQuery {
  title: string,
  password: string,
}

export default class ChatsController {

  private static avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(process.env.IMAGES_STORAGE, 'chats/'));
    },
    filename: function (req, file, cb) {
      const name = 'ava' + Date.now() + '.jpg'; // Could use uuid for unique name
      cb(null, name);
    }
  });

  static uploadAvatar = multer({
    storage: this.avatarStorage,
    limits: {
      fileSize: 3e+7, // 30 mbs
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(null, false);
      }
    }
  });

  static async getChats(req: Request, res: Response) {
    const query = req.query as unknown as getChatsQuery;

    const include: IncludeOptions = {
      association: "chats",
      attributes: ["chatId", "title", "avatar"],
      through: {
        attributes: [],
      }
    };

    if (query.userId) {
      const userWithChats = await User.findOne({
        include,
        attributes: [],
        where: {userId: query.userId}
      });

      return res.json(userWithChats.chats);
    }
    else if (req.user?.userId) {
      const userWithChats = await User.findOne({
        include,
        attributes: [],
        where: {userId: req.user.userId}
      });

      return res.json(userWithChats.chats);
    }

    return res.sendStatus(401);
  }

  static async getChat(req: Request, res: Response) {
    const params = req.params as unknown as getChatParams;
    const query = req.query as unknown as getChatQuery;
    if (typeof +params.id === 'number') {
      const id = +params.id;
      
      const withMessages = query.withMessages && query.withMessages === '1';

      const include = withMessages ? [ ChatMessage ] : [];

      const chat = await Chat.findOne({
        include,
        where: {chatId: id}
      });
      return res.json(chat);
    }
    return res.json({});
  }

  static async getChatMessages(req: Request, res: Response) {
    const params = req.params as unknown as getChatParams;
    if (typeof +params.id === 'number') {
      const id = +params.id;

      const messages = await ChatMessage.findAll({
        include: [User],
        where: {chatId: id}
      });
      return res.json(messages);
    }
    return res.json({});
  }

  static async getChatMembers(req: Request, res: Response) {
    const params = req.params as unknown as getChatParams;
    if (typeof +params.id === 'number') {
      const id = +params.id;

      const include: IncludeOptions = {
        association: 'users',
        attributes: ["userId", "nickname", "avatar"],
      };

      try {
        const chatWithUsers = await Chat.findOne({
          include,
          attributes: [],
          where: {chatId: id}
        });

        const members = chatWithUsers.users.map(user => {
          return {
            userId: user.userId,
            nickname: user.nickname,
            avatar: user.avatar,
          };
        });

        return res.json(members);
      } catch(err) {
        return res.sendStatus(401);
      }

    }
    return res.sendStatus(401);
  }

  static async createChat(req: Request, res: Response) {
    const query: createChatQuery = await req.body;

    const title = query.title;
    const password = query.password ? query.password : null;
    const avatar = req.file?.filename ? req.file.filename : null;

    const validation = validateChat({title, password});

    if (validation) {
      return res.status(400).json(validation);
    }

    try {
      let passwordEncrypted = null;
      if (password) {
        const salt = BCRYPT_SALT;
        passwordEncrypted = await bcrypt.hash(password, salt);
      }
      const chatDB = await Chat.create({
        userId: req.user.userId,
        title,
        password: passwordEncrypted,
        avatar,
      });
      await ChatMember.create({
        userId: req.user.userId,
        chatId: chatDB.chatId,
      });

      const ans: ChatSchema = {
        chatId: chatDB.chatId,
        userId: chatDB.userId,
        title: chatDB.title,
        avatar: chatDB.avatar,
        createdAt: chatDB.createdAt
      };

      return res.json(ans);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        const obj = {
          email: 'This title is already taken!'
        };
        return res.status(400).json(obj);
      }
      console.error(err);
      return res.sendStatus(500);
    }
  }

  static async joinChat(req: Request, res: Response) {
    const query: createChatQuery = await req.body;

    const title = query.title;
    const password = query.password ? query.password : null;

    const validation = validateChat({title, password});

    if (validation) {
      return res.status(400).json(validation);
    }

    try {
      let passwordEncrypted = null;
      if (password) {
        const salt = BCRYPT_SALT;
        passwordEncrypted = await bcrypt.hash(password, salt);
      }
      const chatDB = await Chat.findOne({ where: {
        title,
        password: passwordEncrypted,
      }});

      await ChatMember.create({
        userId: req.user.userId,
        chatId: chatDB.chatId,
      });

      const ans: ChatSchema = {
        chatId: chatDB.chatId,
        userId: chatDB.userId,
        title: chatDB.title,
        avatar: chatDB.avatar,
        createdAt: chatDB.createdAt
      };
 
      const room = 'group chat '+chatDB.chatId; 
      io.to(room).emit('update members');

      return res.json(ans);
    } catch (err) {
      return res.sendStatus(401);
    }
  }
}
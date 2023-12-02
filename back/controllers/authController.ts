import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ChatMember from "../models/chatMembers.model.js";
import Chat from "../models/chats.model.js";
import User from "../models/users.model.js";
import { ProfileTokenSchema, validateProfile, ProfileSchema } from "../schemas/profile.js";

interface SignUpUserQuery {
  nickname: string,
  email: string,
  password: string,
}

interface LogInUserQuery {
  email: string,
  password: string,
} 

export const BCRYPT_SALT = bcrypt.genSaltSync(+process.env.BCRYPT_ROUNDS);


export default class AuthController {

  static createToken(user: ProfileTokenSchema) {
    const encoded = jwt.sign(user, process.env.JWT_SALT);
    return encoded;
  }

  static verifyToken(token: string) {
    const user = jwt.verify(token, process.env.JWT_SALT) as ProfileTokenSchema;
    return user;
  }

  static async isMemberOfChat(chatId: number, userId: number) {

    const member = await ChatMember.findOne({
      where: {
        userId: userId,
        chatId: chatId,
      }
    });

    return !!member;
  }

  static async isCreatorOfChat(chatId: number, userId: number) {

    const member = await Chat.findOne({
      where: {
        userId: userId,
        chatId: chatId,
      }
    });

    return !!member;
  }

  static async signUpUser(req: Request, res: Response) {
    const query: SignUpUserQuery = await req.body;

    const email = query.email;
    const password = query.password;
    const nickname = query.nickname;

    const validation = validateProfile({email, password, nickname});

    if (validation) {
      return res.status(400).json(validation);
    }

    const salt = BCRYPT_SALT;
    const passwordEncrypted = await bcrypt.hash(password, salt);

    try {
      const userDB = await User.create({
        nickname,
        email,
        password: passwordEncrypted,
      });

      const ans: ProfileSchema = {
        userId: userDB.userId,
        nickname: userDB.nickname,
        email: userDB.email,
        description: userDB.description,
        avatar: userDB.avatar,
        createdAt: userDB.createdAt
      };

      return res.json(ans);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        const obj = {
          email: 'This email is already taken!'
        };
        return res.status(400).json(obj);
      }
      return res.sendStatus(500);
    }    
  }

  static async logInUser(req: Request, res: Response) {
    const query: LogInUserQuery = await req.body;

    const email = query.email;
    const password = query.password;

    const validation = validateProfile({email, password});
    if (validation) {
      return res.sendStatus(401);
    }

    const salt = BCRYPT_SALT;
    const passwordEncrypted = await bcrypt.hash(password, salt);


    const userDB = await User.findOne({
      where: {
        email,
        password: passwordEncrypted,
      }
    });

    if (!userDB) {
      return res.sendStatus(401);
    }

    const token = AuthController.createToken({userId: userDB.userId});

    res.cookie('token', token, {
      secure: false,
      expires: new Date(Date.now()+1000*60*60*60),
      path: '/',
      httpOnly: false,
      sameSite: true,
    });


    const ans: ProfileSchema = {
      userId: userDB.userId,
      nickname: userDB.nickname,
      email: userDB.email,
      description: userDB.description,
      avatar: userDB.avatar,
      createdAt: userDB.createdAt
    };

    return res.json(ans);
  }


}
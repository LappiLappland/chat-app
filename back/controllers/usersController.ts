import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { IncludeOptions } from "sequelize";
import User from "../models/users.model.js";

interface getUserParams {
  id: string,
}

interface getUserQuery {
  isOwner?: string,
}


export default class UsersController {

  private static avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(process.env.IMAGES_STORAGE, 'profiles/'));
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

  static async getUser(req: Request, res: Response) {
    const params = req.params as unknown as getUserParams;
    const query = req.query as unknown as getUserQuery;

    const id = params.id;

    try {
      if (query.isOwner === '1') {
        const user = await User.findOne({
          where: {userId: req.user.userId}
        });
        return res.json(user);
      }
      else if (!Number.isNaN(+id)) {
        const user = await User.findOne({
          where: {userId: id}
        });
        return res.json(user);
      }
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') {
        res.sendStatus(400);
      }
      res.sendStatus(500);
    }
    return res.sendStatus(400);
  }
  static async getUserChats(req: Request, res: Response) {
    const params = req.params as unknown as getUserParams;
    if (typeof +params.id === 'number') {
      const id = +params.id;

      if (req.user.userId !== id) return res.sendStatus(403);
      
      const include: IncludeOptions = {
        association: "chats",
        attributes: ["chatId", "title", "avatar"],
        through: {
          attributes: [],
        }
      };

      const userWithChats = await User.findOne({
        include,
        attributes: [],
        where: {userId: id}
      });

      console.log('user =>', userWithChats);

      return res.json(userWithChats.chats);
    }
    return res.json({});
  }
  static async patchUser(req: Request, res: Response) {
    const params = req.params as unknown as getUserParams;
    if (typeof +params.id === 'number') {
      const id = +params.id;
      
      if (req.user.userId !== id) return res.sendStatus(403);
      
      const query = await req.body;

      await User.update(query, {
        where: {
          userId: id,
        }
      });

      return res.json(query);
    }
    return res.sendStatus(400);
  }
  static async createAvatar(req: Request, res: Response) {
    try {
      const id = req.user.userId;
      await User.update(
        {avatar: req.file.filename},
        {where: {userId: id}});
      return res.json({avatar: req.file.filename});
    } catch(err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
}


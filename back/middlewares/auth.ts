import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AuthController from "../controllers/authController.js";
import User from "../models/users.model.js";

export async function authenticate(req: Request, res: Response, next: NextFunction) {

  const authHeader = req.headers['authorization'];

  //Console.log('[auth-header]: ', authHeader);

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.slice(7);

  if (!token || token === 'undefined') {
    return res.sendStatus(401);
  }

  try {
    const user = AuthController.verifyToken(token);

    const userDB = await User.findOne({where: {userId: user.userId}});

    if (!userDB) return res.sendStatus(401); 

    req.user = user;
    return next();
  } catch(err) {
    console.log(err);
    if (err instanceof jwt.TokenExpiredError) {
      return res.sendStatus(403);
    }
    else if (err instanceof jwt.JsonWebTokenError) {
      return res.sendStatus(403);
    }
    return res.sendStatus(501);
  }
}
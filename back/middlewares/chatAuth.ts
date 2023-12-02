import { NextFunction, Request, Response } from "express";
import AuthController from "../controllers/authController.js";
import { getChatParams } from "../controllers/chatsController.js";

export async function authenticateChat(req: Request, res: Response, next: NextFunction) {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const params = req.params as unknown as getChatParams;
  if (Number.isNaN(+params.id)) {
    return res.sendStatus(401);
  }

  const isAllowed = await AuthController.isMemberOfChat(+params.id, req.user.userId);

  if (isAllowed) {
    return next();
  } else {
    return res.sendStatus(403);
  }
}
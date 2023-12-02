import { Router } from "express";
import AuthController from "../controllers/authController.js";

const authRouter = Router();
authRouter.post('/signUp', AuthController.signUpUser);
authRouter.post('/logIn', AuthController.logInUser);
export default authRouter;
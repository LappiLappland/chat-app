import { ProfileTokenSchema } from "../schemas/profile.js";

declare global {
  namespace Express {
    interface Request {
      user?: ProfileTokenSchema,
    }
  }
}
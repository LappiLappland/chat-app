import AuthController from "../../controllers/authController.js";
import User from "../../models/users.model.js";
import { SocketNext, SocketType, _log } from "../index.js";

export default async function AuthorizeSocket(socket: SocketType, next: SocketNext) {
  const token = socket.handshake.auth.token;
  try {
    const user = AuthController.verifyToken(token);

    const userDB = await User.findOne({where: {userId: user.userId}});

    if (!userDB) throw new Error('Unathorized'); 
    
    socket.data.user = {
      userId: user.userId,
    };

    _log('user connected!', socket.data.user);

    next();
  } catch (err) {
    _log(socket.id, 'has failed authorization', '[', token, ']', err);
    next(err);
  }

}
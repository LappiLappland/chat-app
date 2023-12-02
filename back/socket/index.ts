import { createServer } from "http";
import { Server, Socket } from "socket.io";
import AuthController from "../controllers/authController.js";
import ChatMember from "../models/chatMembers.model.js";
import ChatMessage from "../models/chatMessages.model.js";
import Chat from "../models/chats.model.js";
import User from "../models/users.model.js";
import { ChatMessageSchema, ValidateChatMessage } from "../schemas/chatMessage.js";
import AuthorizeSocket from "./middlewares/auth.js";

type srvr = ReturnType<typeof createServer>;

interface ServerToClientEvents {
  'get chat message': (message: ChatMessageSchema) => void,
  'update members': () => void,
  'chat removed': () => void,
}

interface ClientToServerEvents {
  'connect to chat': (chatId: number) => void,
  'disconnect from chat': (chatId: number) => void,
  'leave chat': (chatId: number) => void,
  'join chat': (chatId: number) => void,
  'remove chat': (chatId: number) => void,
  'send chat message': (message: {chatId: number, text: string}, response: (msg: ChatMessageSchema, errorMessage: null | string) => void) => void,
}

interface InterServerEvents {

}

interface SocketData {
  user: {userId: number},
}

export function _log(...strs: unknown[]) {
  console.log('[🌐]',...strs);
}

export type SocketType = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SocketNext = (err?: any) => void;


export default function SocketIOInitialize(server: srvr) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: /http:\/\/localhost:[0-9]+/,
    },
  });

  io.use(AuthorizeSocket);

  io.on('connection', (socket) => {

    socket.on('connect to chat', async (chatId) => {
      _log('CHAT:', chatId, socket.id);
      try {
        const isAllowed = await AuthController.isMemberOfChat(chatId, socket.data.user.userId);
        if (isAllowed) socket.join('group chat '+chatId);
      } catch(err) {
        return;
      }
    });

    socket.on('disconnect from chat', async (chatId) => {
      _log('DISCONNECT CHAT:', chatId, socket.id);
      socket.leave('group chat '+chatId);
    });

    socket.on('leave chat', async (chatId) => {
      _log('LEAVE CHAT:', chatId, socket.data.user.userId, socket.data.user);
      const isAllowed = await AuthController.isMemberOfChat(chatId, socket.data.user.userId);
      if (!isAllowed) return;
      try {
        await ChatMember.destroy({where: {
          userId: socket.data.user.userId,
          chatId: chatId,
        }});
        const room = 'group chat '+chatId; 
        socket.broadcast.to(room).emit('update members');
      } catch(err) {
        return;
      }
    });

    socket.on('remove chat', async (chatId) => {
      _log('REMOVE CHAT:', chatId, socket.data.user.userId, socket.data.user);
      const isAllowed = await AuthController.isCreatorOfChat(chatId, socket.data.user.userId);
      if (!isAllowed) return;
      try {
        await Chat.destroy({where: {
          userId: socket.data.user.userId,
          chatId: chatId,
        }});
        const room = 'group chat '+chatId; 
        io.to(room).emit('chat removed');
      } catch(err) {
        return;
      }
    });

    socket.on('join chat', (chatId) => {
      const room = 'group chat '+chatId; 
      socket.broadcast.to(room).emit('update members');
    });

    socket.on('send chat message', async (msg, response) => {
      _log('MESSAGE:', msg, socket.id);

      if (!socket.rooms.has('group chat '+msg.chatId)) {
        _log('MESSAGE: Unknown chat');
        return response(null, 'Unknown chat');
      }

      const validation = ValidateChatMessage(msg);

      if (validation) {
        _log('MESSAGE: Validation failed');
        return response(null, 'Message is too long');
      }

      let userDB;
      try {
        userDB = await User.findOne({
          where: {userId: socket.data.user.userId}
        });
      } catch (err) {
        if (err.name === 'SequelizeDatabaseError') {
          _log('MESSAGE: Database failed User');
          return response(null, 'User not found');
        }
        return response(null, 'Internal error');
      }

      try {
        const messageDB = await ChatMessage.create({
          chatId: msg.chatId,
          userId: socket.data.user.userId,
          text: msg.text,
        });
        const messageReturn: ChatMessageSchema = {
          messageId: messageDB.messageId,
          chatId: messageDB.chatId,
          text: messageDB.text,
          user: {
            userId: userDB.userId,
            avatar: userDB.avatar,
            nickname: userDB.nickname,
          },
          updatedAt: messageDB.updatedAt,
          createdAt: messageDB.createdAt,
        };

            
        const room = 'group chat '+msg.chatId; 
        socket.broadcast.to(room).emit("get chat message", messageReturn);

        response(messageReturn, null);
      } catch (err) {
        if (err.name === 'SequelizeDatabaseError') {
          _log('MESSAGE: Database failed Message');
          return response(null, 'Internal server error');
        }
        return response(null, 'Internal error');
      }
    });
  });

  return io;
}
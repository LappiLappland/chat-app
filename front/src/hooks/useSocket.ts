import { useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { UserContext } from '../components/UserContext';
import { getCookie } from '../helpers/cookies';
import { ChatMessageSchema } from '../schemas/chatMessage';

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


const URL = 'http://localhost:80/';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: false,
  auth: {
    token: getCookie('token'), // We connect, when authorized. Token will exist.
  },
});

type useSocketType = [typeof socket];

export default function useSocket(): useSocketType {
  
  const user = useContext(UserContext);
  
  useEffect(() => {
    if (user) {
      socket.connect();
    }
  }, [user]);
  
  return [socket];
}
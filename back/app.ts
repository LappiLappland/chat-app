import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { createServer } from 'http';
import { resolve } from 'path';
import DB from './models/index.js';
import authRouter from './routes/authRoutes.js';
import chatsRouter from './routes/chatsRoutes.js';
import usersRouter from './routes/usersRoutes.js';
import SocketIOInitialize from './socket/index.js';

dotenv.config();

const port_server = process.env.SERVER_PORT;
const port_socket = process.env.SOCKET_PORT;

if (port_server === port_socket) {
  throw new Error('Socket port and Server port should be different!');
}

const runDatabase = async () => {
  await DB.syncronize();
  await DB.fillDebug();
};
runDatabase();

const createDir = (pathPart: string) => {
  const path = resolve(process.env.IMAGES_STORAGE, pathPart);
  if (!existsSync(path)) {
    mkdirSync(path);
  }
};

createDir('profiles');
createDir('chats');

const app: Express = express();

const corsOptions: CorsOptions = {
  origin: /http:\/\/localhost:[0-9]+/,
  credentials: true,
};


app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/', authRouter);
app.use('/api/', usersRouter);
app.use('/api/', chatsRouter);

app.listen(port_server, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port_server}`);
});

//Use nginx to serve instead
//app.use('/', express.static('./../front/dist'));

const server = createServer(app);
const io = SocketIOInitialize(server);

server.listen(port_socket, () => {
  console.log(`⚡️[socket.io]: Socket.io is running on port ${port_socket}`);
});

export { io };

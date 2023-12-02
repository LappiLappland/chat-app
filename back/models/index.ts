import bcrypt from "bcrypt";
import { Sequelize } from "sequelize-typescript";
import { BCRYPT_SALT } from "../controllers/authController.js";
import ChatMember from "./chatMembers.model.js";
import ChatMessage from "./chatMessages.model.js";
import Chat from "./chats.model.js";
import User from "./users.model.js";

//Const sequelize = new Sequelize('sqlite::memory:');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database',
  models: [User, Chat, ChatMessage, ChatMember],
  logging: false,
});

class DB {

  static sequelize: Sequelize;

  static {
    DB.sequelize = sequelize;
  }

  static async syncronize() {
    await DB.sequelize.sync({ force: true });
  }

  static async fillDebug() {
    await User.create({
      email: "lol",
      nickname: "Guy 1",
      password: "123"
    });
    await User.create({
      email: "kek",
      nickname: "Guy 2",
      password: "123"
    });

    const texasPassword = await bcrypt.hash("randomPass", BCRYPT_SALT);
    await User.create({
      email: "texas@penguins.com",
      nickname: "Texas",
      password: texasPassword,
    });
    await Chat.create({
      title: "Chat 1",
      userId: 1,
    });

    await ChatMessage.create({
      chatId: 1,
      userId: 1,
      text: "Text 1",
    });
    await ChatMessage.create({
      chatId: 1,
      userId: 2,
      text: "Text 2",
    });

    await ChatMember.create({
      chatId: 1,
      userId: 1,
    });
    await ChatMember.create({
      chatId: 1,
      userId: 2,
    });

  }

}

export default DB;
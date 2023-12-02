import { AllowNull, AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Chat from "./chats.model.js";
import User from "./users.model.js";

@Table({
  updatedAt: false,
})
class ChatMember extends Model {

  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  declare memberId: number;

  @ForeignKey(() => Chat)
  @AllowNull(false)
  @Column
  declare chatId: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  declare userId: number;

}

export default ChatMember;
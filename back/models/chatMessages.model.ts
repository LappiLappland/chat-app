import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Chat from "./chats.model.js";
import User from "./users.model.js";

@Table
class ChatMessage extends Model {

  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  declare messageId: number;

  @ForeignKey(() => Chat)
  @AllowNull(false)
  @Column
  declare chatId: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  declare userId: number;

  @AllowNull(false)
  @Column(DataType.STRING(300))
  declare text: string;

  @BelongsTo(() => Chat)
  declare chat: ReturnType<() => Chat>;

  @BelongsTo(() => User)
  declare user: ReturnType<() => User>;

}

export default ChatMessage;
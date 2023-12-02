import { AllowNull, AutoIncrement, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import ChatMember from "./chatMembers.model.js";
import ChatMessage from "./chatMessages.model.js";
import User from "./users.model.js";

@Table({
  updatedAt: false,
})
class Chat extends Model {

  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  declare chatId: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  declare userId: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(30))
  declare title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare password: string;

  @Column(DataType.TEXT)
  declare avatar: string;

  @HasMany(() => ChatMessage)
  declare chatMessages: ChatMessage[];

  @BelongsTo(() => User)
  declare user: ReturnType<() => User>;

  @BelongsToMany(() => User, () => ChatMember)
  declare users: User[];

}

export default Chat;
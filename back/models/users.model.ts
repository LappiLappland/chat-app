import { AllowNull, AutoIncrement, BelongsToMany, Column, DataType, Default, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import ChatMember from "./chatMembers.model.js";
import ChatMessage from "./chatMessages.model.js";
import Chat from "./chats.model.js";

@Table({
  updatedAt: false,
})
class User extends Model {

  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  declare userId: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.TEXT)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare nickname: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare password: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(300))
  declare description: string;

  @Column(DataType.TEXT)
  declare avatar: string;
  
  @HasMany(() => Chat)
  declare createdChats: Chat[];

  @BelongsToMany(() => Chat, () => ChatMember)
  declare chats: Chat[];

  @HasMany(() => ChatMessage)
  declare chatMessages: ChatMessage[];
}

export default User;
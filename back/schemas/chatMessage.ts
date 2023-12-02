import { ProfileShortSchema } from "./profile.js";
import validatorF from 'validator';

const validator = validatorF.default;

export interface ChatMessageSchema {
  messageId: number,
  chatId: number,
  text: string,
  user: ProfileShortSchema,
  updatedAt: Date,
  createdAt: Date,
}

export interface ChatGroupedMessagesSchema {
  messageId: number,
  chatId: number,
  texts: string[],
  user: ProfileShortSchema,
  updatedAt: Date,
  createdAt: Date,
}

interface ValidatableChat {
  text?: string,
}

export function ValidateChatMessage(obj: ValidatableChat) {
  return !validator.isLength(obj.text, {min: 0, max: 150});
}
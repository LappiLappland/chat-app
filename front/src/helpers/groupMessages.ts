import { ChatGroupedMessagesSchema, ChatMessageSchema } from "../schemas/chatMessage";
import { dateDifference } from "./date";

export const MESSAGE_TIME_DIFFERENCE = 1000 * 60 * 2;

export function groupMessages(messages: ChatMessageSchema[]) {
  return messages.reduce((prev: ChatGroupedMessagesSchema[], curr) => {
    if (prev.length === 0) {
      return [{...curr, text: undefined, texts: [curr.text]}];
    } else {
      const lastElement = prev[prev.length - 1];
      const diff = dateDifference(curr.createdAt, lastElement.createdAt);
      const isSameUser = lastElement.user.userId === curr.user.userId;
      const isSmallDifference = diff < MESSAGE_TIME_DIFFERENCE;  
      if (isSmallDifference && isSameUser) {
        lastElement.texts = [...lastElement.texts, curr.text];
        return prev;
      } else {
        return [...prev, {...curr, text: undefined, texts: [curr.text]}];
      }
    }
  }, []);
}
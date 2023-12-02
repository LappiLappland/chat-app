import { ChatSchema } from "../../schemas/chat";
import { ChatMessageSchema } from "../../schemas/chatMessage";
import { ProfileShortSchema } from "../../schemas/profile";
import { fetchGet, fetchPost } from "./easyFetch";


interface FetchChatsOptions {
  userId?: number,
}

export async function fetchChats({userId}: FetchChatsOptions) {

  const query = userId ? {userId: userId + ''} : {};

  const chats: ChatSchema[] = await fetchGet({
    path: 'chats',
    query,
    needsToken: true,
  });
  
  return chats;
}

interface FetchChatOptions {
  chatId: number,
}

export async function fetchChat({chatId}: FetchChatOptions) {
  const chat: ChatSchema = await fetchGet({
    path: ['chat', chatId+''],
    needsToken: true,
  });

  return chat;
}

interface FetchChatMembersOptions {
  chatId: number,
}

export async function fetchChatMembers({chatId}: FetchChatMembersOptions) {
  const members: ProfileShortSchema[] = await fetchGet({
    path: ['chat', chatId+'', 'members'],
    needsToken: true,
  });

  return members;
}

interface FetchChatCreateOptions {
  title?: string,
  password?: string,
  avatar?: File | null,
}

export async function fetchChatCreate(create: FetchChatCreateOptions) {
  
  const form = new FormData();
  form.append('title', create.title);
  form.append('password', create.password);
  if (create.avatar) form.append('avatar', create.avatar);
  
  const chat: ChatSchema = await fetchPost({
    method: 'POST',
    path: 'chat',
    body: form,
    needsToken: true,
  });

  return chat;
}

interface FetchChatJoinOptions {
  title?: string,
  password?: string,
}

export async function fetchChatJoin(obj: FetchChatJoinOptions) {
  
  const chat: ChatSchema = await fetchPost({
    method: 'POST',
    path: 'chat/join',
    body: obj,
    needsToken: true,
  });

  return chat;
}
interface FetchMessagesOptions {
  chatId: number,
}

export async function fetchMessages({chatId}: FetchMessagesOptions) {
  const messages: ChatMessageSchema[] = await fetchGet({
    path: ['chat', chatId+'', 'messages'],
    needsToken: true,
  });

  return messages;
}
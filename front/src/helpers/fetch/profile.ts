import { ProfileSchema } from "../../schemas/profile";
import { fetchGet, fetchPost } from "./easyFetch";


interface FetchProfileOptions {
  userId?: string,
}

export async function fetchProfile({userId}: FetchProfileOptions) {
  userId = userId ? userId+'' : '@me';

  if (userId.toLowerCase() === '@me') {
    const user: ProfileSchema = await fetchGet({
      path: ['user',''],
      query: {isOwner: '1'},
      needsToken: true,
    });
    return user;
  } else {
    const user: ProfileSchema = await fetchGet({
      path: ['user', userId],
      needsToken: true,
    });
    return user;
  }
}

interface FetchProfileUpdateOptions {
  userId: number,
  update: {
    nickname?: string,
    description?: string,
  }
}

export async function fetchProfileUpdate({userId, update}: FetchProfileUpdateOptions) {
  const profile = fetchPost({
    method: 'PATCH',
    path: ['user', userId+''],
    body: update,
    needsToken: true,
  });

  return profile;
}

interface FetchProfileAvatarOptions {
  file: File,
}

export async function fetchProfileAvatar({file}: FetchProfileAvatarOptions) {
  
  const form = new FormData();
  form.set('avatar', file);
  const avatar = await fetchPost({
    method: 'POST',
    path: ['user', 'avatar'],
    body: form,
    needsToken: true,
  });

  return avatar;
}
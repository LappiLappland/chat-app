export default function imagePath(name: string | null, type: 'profile' | 'chat') {
  if (!name) return "/uploads/placeholder.png";

  const sharedPath = '/uploads/';
  let path: string;
  switch (type) {
  case 'profile':
    path = 'profiles/';
    break;
  case 'chat':
    path = 'chats/';
    break;
  }
  return sharedPath + path + name;
}
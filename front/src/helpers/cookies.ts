
export function getCookie(name: string) {
  const cookie = document.cookie
    .split('; ')
    .find(pair => pair.startsWith(name+'='))
    ?.split('=')[1];

  return cookie;
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
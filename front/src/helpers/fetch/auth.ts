import { fetchPost } from "./easyFetch";


interface FetchSignUpOptions {
  email: string,
  nickname: string,
  password: string,
}

export async function fetchSignUp(user: FetchSignUpOptions) {
  const status = await fetchPost({
    method: 'POST',
    path: 'signUp',
    body: user,
  });

  return status;
}

interface FetchLogInOptions {
  email: string,
  password: string,
}

export async function fetchLogIn(user: FetchLogInOptions) {
  const status = await fetchPost({
    method: 'POST',
    path: 'logIn',
    body: user,
  });

  return status;
}
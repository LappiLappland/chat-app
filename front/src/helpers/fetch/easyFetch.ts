import { getCookie } from "../cookies";
import { ForbiddenError, NetworkError, UnauthorizedError } from "./errors";

const SERVER_PATH = 'http://localhost:80/api/';

interface fetchGetOptions {
  path: string | string[],
  query?: Record<string, string> | null,
  needsToken?: boolean,
}

export async function fetchGet<T>({path, query, needsToken = false}: fetchGetOptions): Promise<T> {

  const linkQuery = !query ? '' :  new URLSearchParams(query);

  const relativeLink = typeof path === 'string' ? path : path.join('/') ;
  const url = SERVER_PATH + relativeLink + '?' + linkQuery;

  const token = getCookie('token');
  if (needsToken && !token) throw new UnauthorizedError();
  
  const headers: Headers = new Headers();
  if (token) headers.set('authorization', 'bearer ' + token);

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });


  if (response.ok) {
    const ans = response.headers.get('Content-Type');
    if (ans.includes('application/json')) {
      const object = await response.json();
      return object;
    } else {
      return null;
    }
  } else {
    let object: unknown = null;
    const ans = response.headers.get('Content-Type');
    if (ans.includes('application/json')) {
      object = await response.json();
    }

    if (response.status === 401) {
      throw new UnauthorizedError(object);
    }
    else if (response.status === 403) {
      throw new ForbiddenError(object);
    }
    else {
      throw new NetworkError(object);
    }
  }
}

interface fetchPostOptions {
  path: string | string[],
  method?: 'POST' | 'PATCH',
  body: object | FormData,
  needsToken?: boolean,
}

export async function fetchPost<T>({path, method = 'POST', body, needsToken = false}: fetchPostOptions): Promise<T> {

  const relativeLink = typeof path === 'string' ? path : path.join('/') ;
  const url = SERVER_PATH + relativeLink;

  let realBody: string | FormData;
  let contentType = '';
  if (body instanceof FormData) {
    realBody = body;
  } else {
    realBody = JSON.stringify(body);
    contentType = 'application/json';
  }

  const token = getCookie('token');
  if (needsToken && !token) throw new UnauthorizedError();

  const headers: Headers = new Headers();
  if (token) headers.set('authorization', 'bearer ' + token);
  if (contentType) headers.set('Content-Type', contentType);

  const response = await fetch(url, {
    method,
    headers,
    body: realBody,
    credentials: 'include',
  });


  if (response.ok) {
    const ans = response.headers.get('Content-Type');
    if (ans.includes('application/json')) {
      const object = await response.json();
      return object;
    } else {
      return null;
    }
  } else {
    let object: unknown = null;
    const ans = response.headers.get('Content-Type');
    if (ans.includes('application/json')) {
      object = await response.json();
    }

    if (response.status === 401) {
      throw new UnauthorizedError(object);
    }
    else if (response.status === 403) {
      throw new ForbiddenError(object);
    }
    else {
      throw new NetworkError(object);
    }
  }
}
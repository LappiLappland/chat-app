import { createContext, ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getCookie, removeCookie } from "../helpers/cookies";
import { fetchLogIn } from "../helpers/fetch/auth";
import { UnauthorizedError } from "../helpers/fetch/errors";
import { fetchProfile } from "../helpers/fetch/profile";
import queryRetry from "../helpers/queryRetry";
import useSocket from "../hooks/useSocket";
import { ProfileSchema, ProfileShortSchema } from "../schemas/profile";

interface logInData {
  email: string,
  password: string,
}

interface UserContext {
  user: ProfileShortSchema,
  token: string | null,
  logIn: (data?: logInData) => void,
  logOut: () => void,
}

interface UserComponentProps {
  children?: ReactNode
}

export const UserContext = createContext<UserContext>(null);

export function UserComponent({children}: UserComponentProps) {

  const [socket] = useSocket();

  const { data: profile, error, refetch } = useQuery({
    queryKey: ['profile', '@me'],
    queryFn: () => fetchProfile({}),
    retry: (count, error) => queryRetry(count, error),
    enabled: false,
  });
  const [user, setUser] = useState<ProfileShortSchema>(null);

  useEffect(() => {
    if (error) {
      if (error instanceof UnauthorizedError) {
        logOut();
      }
    }
    else if (profile) {
      setUser({
        userId: profile.userId,
        nickname: profile.nickname,
        avatar: profile.avatar,
      });
    }
  }, [profile, error]);

  useEffect(() => {
    if (user) socket.connect();
  }, [user]);

  async function logIn(logInData?: logInData) {
    if (!logInData) {
      refetch();
    } else {
      const profile = await fetchLogIn(logInData) as ProfileSchema;
      setUser({
        userId: profile.userId,
        nickname: profile.nickname,
        avatar: profile.avatar,
      });
    }
  }

  async function logOut() {
    removeCookie('token');
    setUser(null);
    socket.disconnect();
  }

  useEffect(() => {
    const token = getCookie('token');
    if (token) logIn();
  }, []);

  const contextObject = {
    user: user,
    token: getCookie('token'),
    logIn,
    logOut
  };

  return (
    <UserContext.Provider value={contextObject}>
      {children}
    </UserContext.Provider>
  );
}
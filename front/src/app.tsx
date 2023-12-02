import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  createHashRouter,
  redirect,
  RouterProvider
} from "react-router-dom";
import { UserComponent } from "./components/UserContext";
import './styles/animations.scss';
import './styles/main.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});

queryClient.invalidateQueries();

const router = createHashRouter([
  {
    path: "/",
    loader: () => redirect('/profile/@me'),
  },
  {
    path: "/profile/:userId",
    async lazy() {
      const { default: page } = await import('./pages/profilePage');
      return { Component: page };
    }
  },
  {
    path: "/chat/:chatId",
    async lazy() {
      const { default: page } = await import('./pages/chatRoomPage');
      return { Component: page };
    }
  },
  {
    path: "/createChat",
    async lazy() {
      const { default: page } = await import('./pages/createChatPage');
      return { Component: page };
    }
  },
  {
    path: "/joinChat",
    async lazy() {
      const { default: page } = await import('./pages/joinChatPage');
      return { Component: page };
    }
  },
  {
    path: "/signUp",
    async lazy() {
      const { default: page } = await import('./pages/signUpPage');
      return { Component: page };
    }
  },
  {
    path: "/logIn",
    async lazy() {
      const { default: page } = await import('./pages/logInPage');
      return { Component: page };
    }
  },
]);

export default function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <UserComponent>
          <RouterProvider router={router} />
        </UserComponent>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { fetchChats } from '../../helpers/fetch/chat';
import queryRetry, { queryFail } from '../../helpers/queryRetry';
import '../../styles/main-left-bar.scss';
import Disclosure from '../disclosure';
import Loader from '../loader';
import ChatItem from "./chatItem";
import ProfileItem from './profileItem';

interface MainLeftBarProps {

}

export default function MainLeftBar({ }: MainLeftBarProps) {

  const navigate = useNavigate();
  const { isLoading, isError, data: chats, error} = useQuery({
    queryKey: ['profile', '@me', 'chats'],
    queryFn: () => fetchChats({}),
    retry: (count, error) => queryRetry(count, error),
  });
  useEffect(() => {queryFail(error, navigate);}, [error]);
  

  let ChatsList = <></>;
  if (isLoading) {
    ChatsList = <div className="loader-container"><Loader /></div>;
  }
  else if (isError) {
    ChatsList = <span className="loader-container">Failed to load</span>;
  }
  else {
    const ChatElements = !chats ? [] : chats.map((chat) => {
      return (
        <ChatItem key={chat.chatId}
          title={chat.title}
          chatId={chat.chatId}
          avatar={chat.avatar}
        />
      );
    });
    ChatsList = (
      <Disclosure title="Chats">
        {ChatElements}
      </Disclosure>
    );
  }

  return (
    <aside className="main-left-bar">
      <input id="left-menu-toggle" type="checkbox" defaultValue="!!"></input>
      <label htmlFor="left-menu-toggle" className="menu-button-container">
        <div className="menu-button"></div>
      </label>
      <nav>
        <ProfileItem 
          title="Profile"
        />
        <Link className="left-bar-button"
          to="/createChat"
        >
          Create chat
        </Link>
        <Link className="left-bar-button"
          to="/joinChat"
        >
          Join chat
        </Link>
        {ChatsList}
      </nav>
    </aside>
  );
}

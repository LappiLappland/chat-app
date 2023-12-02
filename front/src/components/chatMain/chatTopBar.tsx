import { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import imagePath from "../../helpers/imagePath";
import useSocket from "../../hooks/useSocket";
import { ChatSchema } from "../../schemas/chat";
import { UserContext } from "../UserContext";
import '../../styles/main-chat-top-bar.scss';

interface ChatTopBarProps {
  chat: ChatSchema,
}

export default function ChatTopBar({ chat }: ChatTopBarProps) {

  const [socket] = useSocket();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useContext(UserContext);

  const [showMenu, setShowMenu] = useState(false);

  function leaveChatHandler() {
    socket.emit('leave chat', chat.chatId);
    queryClient.invalidateQueries(['profile', '@me', 'chats']);
    navigate('/profile/@me');
  }

  function deleteChatHandler() {
    socket.emit('remove chat', chat.chatId);
  }

  const actionsList = [
    <ActionItem key={0} title="Leave chat" action={leaveChatHandler}></ActionItem>
  ];

  if (user && user.user && user.user.userId === chat.userId) {
    actionsList.push((
      <ActionItem key={'a'+0} title="Delete chat" action={deleteChatHandler}></ActionItem>
    ));
  }

  return (
    <div className="top-bar">
      <div>
        <img src={imagePath(chat.avatar, 'chat')} alt="avatar"/>
        <span>{chat.title}</span>
      </div>
      <div className="top-bar-actions">
        <button
          onClick={() => setShowMenu(!showMenu)}
        >
          actions
        </button>
        {!showMenu ? <></> : (<ul>
          {actionsList}
        </ul>)}
      </div>
    </div>
  );
}

interface ActionItemProps {
  action: () => void,
  title: string,
}

function ActionItem({ action, title }: ActionItemProps) {
  return (
    <li>
      <button
        onClick={() => action()}
      >
        {title}
      </button>
    </li>
  );
}
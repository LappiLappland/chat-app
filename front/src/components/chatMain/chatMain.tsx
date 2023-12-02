import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { fetchChat } from "../../helpers/fetch/chat";
import queryRetry, { queryFail } from "../../helpers/queryRetry";
import useSocket from "../../hooks/useSocket";
import Loader from "../loader";
import ChatContainer from "./chatContainer";
import ChatTopBar from "./chatTopBar";

interface ChatMainProps {
  chatId: number,
}

export default function ChatMain({ chatId }: ChatMainProps) {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, isError, data: chat, error } = useQuery({
    queryKey: ['chat', chatId+''],
    queryFn: () => fetchChat({chatId}),
    retry: (count, error) => queryRetry(count, error),
  });
  useEffect(() => {queryFail(error, navigate);}, [error]);

  const [socket] = useSocket();

  useEffect(() => {
    socket.emit('connect to chat', chatId);
    function onChatDeleted() {
      queryClient.invalidateQueries(['profile', '@me', 'chats']);
      navigate('/profile/@me');
    }
    socket.on('chat removed', onChatDeleted);
    return () => {
      socket.emit('disconnect from chat', chatId);
      socket.off('chat removed', onChatDeleted);
    };
  }, [socket]);

  if (isLoading) return (
    <main className="main-chat flex-center">
      <Loader />
    </main>
  );
  if (isError || !chat) return (
    <main className="main-chat flex-center">
      <span>Failed to load page</span>
      <span>Check your Internet connection and refresh page</span>
    </main>
  );

  return (
    <main className="main-chat">
      <ChatTopBar 
        chat={chat}
      />
      <ChatContainer 
        chatId={chatId}
      />
    </main>
  );
}
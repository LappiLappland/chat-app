import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { fetchMessages } from "../../helpers/fetch/chat";
import { groupMessages } from "../../helpers/groupMessages";
import queryRetry, { queryFail } from "../../helpers/queryRetry";
import useSocket from "../../hooks/useSocket";
import { ChatMessageSchema } from "../../schemas/chatMessage";
import Loader from "../loader";
import ChatInputBox, { MessageStatus } from "./chatInputBox";
import ChatMessagesContainer from "./chatMessagesContainer";

interface ChatContainerProps {
  chatId: number
}

export default function ChatContainer({chatId}: ChatContainerProps) {

  const navigate = useNavigate();

  const { isLoading, isError, data: fetchedMsges, error} = useQuery({
    queryKey: ['chat', chatId+'', 'messages'],
    queryFn: () => fetchMessages({chatId}),
    retry: (count, error) => queryRetry(count, error),
  });
  useEffect(() => {queryFail(error, navigate);}, [error]);

  const [socket] = useSocket();

  const [allMessages, setAllMessages] = useState<ChatMessageSchema[]>([]);
  const [messageStatus, setMessageStatus] = useState<MessageStatus>(MessageStatus.writing);

  const errorTimer = useRef<NodeJS.Timeout | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const groupedMessages = useMemo(() => {
    return groupMessages(allMessages);
  }, [allMessages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const e = messagesContainerRef.current;
      if (Math.abs(e.scrollHeight - e.scrollTop - e.clientHeight) < 30) {
        e.scrollTo(0, e.scrollHeight);
      }
    } 
  }, [groupedMessages]);


  useEffect(() => {
    if (fetchedMsges && fetchedMsges.length > 0) {
      setAllMessages(fetchedMsges);
    }
  }, [fetchedMsges]);

  useEffect(() => {
    function onNewMessage(msg: ChatMessageSchema) {
      setAllMessages(old => [...old, msg]);
    }
    socket.on('get chat message', onNewMessage);

    return () => {
      socket.off('get chat message', onNewMessage);
    };
  }, [socket]);

  function onUserSendMessage(msg: string) {
    setMessageStatus(MessageStatus.sending);
    clearTimeout(errorTimer.current);

    const triggerError = () => {
      setMessageStatus(MessageStatus.failed);
      errorTimer.current = setTimeout(() => setMessageStatus(MessageStatus.writing), 5000);
    };

    errorTimer.current = setTimeout(() => triggerError(), 5000);

    socket.emit('send chat message', {text: msg, chatId}, (msg, error) => {
      clearTimeout(errorTimer.current);
      if (!error) {
        setAllMessages(old => [...old, msg]);
        setMessageStatus(MessageStatus.writing);
      }
      else {
        triggerError();
      }
    });
  }

  let MessagesContainer = (
    <ChatMessagesContainer ref={messagesContainerRef}
      messages={groupedMessages}
    />
  );
  if (isLoading) {
    MessagesContainer = <Loader />;
  }
  else if (isError) {
    MessagesContainer = <span>Failed to load</span>;
  }

  return (
    <>
      {MessagesContainer}
      <ChatInputBox
        status={messageStatus}
        onSend={onUserSendMessage}
      ></ChatInputBox>
    </>
  );
}
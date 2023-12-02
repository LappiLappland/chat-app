import { forwardRef } from "react";
import { ChatGroupedMessagesSchema } from "../../schemas/chatMessage";
import ChatMessage from "./chatMessage";

interface ChatMessagesContainerProps {
  messages: ChatGroupedMessagesSchema[],
}


export default forwardRef<HTMLDivElement, ChatMessagesContainerProps>(function ChatMessagesContainer({
  messages
}, ref) {

  const MessageElements = messages.map((msg) => {
    return (
      <ChatMessage key={msg.messageId}
        nickname={msg.user.nickname}
        createdAt={msg.createdAt}
        texts={msg.texts}
        avatar={msg.user.avatar}
      />
    );
  });

  return ( 
    <div className="chat-container"
      ref={ref}
    >
      {MessageElements}
    </div>
  );

});
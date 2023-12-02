import { getFormattedDate } from "../../helpers/date";
import imagePath from "../../helpers/imagePath";
import '../../styles/main-chat-message.scss';

interface ChatMessageProps {
  nickname: string,
  createdAt: Date,
  texts: string[],
  avatar: string | null,
}

export default function ChatMessage({nickname, texts, createdAt, avatar}: ChatMessageProps) {
  
  const MessageLines = texts.map((text, index) => {
    return (
      <span key={index}>
        {text}
      </span>
    );
  });

  return (
    <span className="chat-message-container">
      <img src={imagePath(avatar, 'profile')} alt="avatar" />
      <div className="message-data">
        <span className="message-user">
          <span className="message-nickname">
            {nickname}
          </span>
          <span className="message-created-date">
            {getFormattedDate(createdAt)}
          </span>
        </span>
        <div className="message-lines">
          {MessageLines}
        </div>
      </div>
    </span>
  );
}
import { Link } from "react-router-dom";
import imagePath from "../../helpers/imagePath";
import '../../styles/disclosure-chat-item.scss';

interface ChatItemProps {
  title: string,
  chatId: number,
  avatar: string | null,
}

export default function ChatItem({ title, chatId, avatar }: ChatItemProps) {
  return (

    <Link className="chat-item"
      to={"/chat/"+chatId}
    >
      <img src={imagePath(avatar, 'chat')} alt="avatar"/>
      <span>
        {title}
      </span>
    </Link>
  );
}
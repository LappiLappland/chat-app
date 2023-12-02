import '../styles/main.scss';
import '../styles/main-chat.scss';
import MainLeftBar from '../components/mainLeftBar/mainLeftBar';
import MainRightBar from '../components/mainRightBar/mainRightBar';
import ChatMain from '../components/chatMain/chatMain';
import { useParams } from 'react-router-dom';

export default function ChatRoomPage() {

  const param = useParams<{chatId: string}>();
  const chatId = !Number.isNaN(+param.chatId) ? +param.chatId : null;

  return (
    <div className="main-window">
      <MainLeftBar />
      {!chatId ? <>Page not found</> : (
        <>
          <ChatMain chatId={+param.chatId} />
          <MainRightBar chatId={+param.chatId} />
        </>
      )}

    </div>
  );
}

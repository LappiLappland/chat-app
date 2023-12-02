import { useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import MainLeftBar from "../components/mainLeftBar/mainLeftBar";
import { fetchChatJoin } from "../helpers/fetch/chat";
import { NetworkError } from "../helpers/fetch/errors";
import '../styles/main-form.scss';

export default function JoinChatPage() {

  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const queryClient = useQueryClient();
  const navigate = useNavigate();


  async function onButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    try {
      const chat = await fetchChatJoin({title, password});
      queryClient.invalidateQueries(['profile', '@me', 'chats']);
      navigate('/chat/'+chat.chatId);
    } catch (err) {
      if (err instanceof NetworkError) {
        setError('Failed to join chat!');
      }
    }
  } 

  return (
    <div className="main-window">
      <MainLeftBar />
      <div className="form-window">
        <form>
          <h2>Join chat</h2>
          <div className="form-column">
            <div className="form-row">
              <label htmlFor="chatName">
                Chat title
              </label>
              <input
                id="chatName"
                type="text"
                placeholder="Chat title"
                value={title}
                onChange={(e) => {setTitle(e.target.value); setError('');}}
              />
            </div>
            <div className="form-row">
              <label htmlFor="chatPassword">
                Chat password
              </label>
              <input
                id="chatPassword"
                type="password"
                placeholder="Leave empty for public server"
                value={password}
                onChange={(e) => {setPassword(e.target.value); setError('');}}
              />
            </div>
          </div>
          {error ? <span className="error">{error}</span> : <></>}
          <button onClick={(e) => onButton(e)}>
            Join chat
          </button>
        </form>
      </div>

    </div>
  );
}

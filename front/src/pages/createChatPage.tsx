import { useReducer } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import DragAndDrop from "../components/dragAndDrop";
import MainLeftBar from "../components/mainLeftBar/mainLeftBar";
import { fetchChatCreate } from "../helpers/fetch/chat";
import { NetworkError } from "../helpers/fetch/errors";
import { validateChat } from "../schemas/chat";
import '../styles/main-form.scss';

interface FormParams {
  title: string,
  password: string,
  avatar: File | null,
}

interface FormState {
  input: FormParams,
  error: FormParams,
}

interface FormAction {
  type?: 'input' | 'error',
  values: Partial<FormParams>
}

export default function CreateChatPage() {

  function formReducer(state: FormState, action: FormAction, ) {
    if (!action.type || action.type === 'input') {
      const input = {
        ...state.input,
        ...action.values,
      };
      const errorReset = Object.keys(action.values).reduce((prev, curr) => {
        return {
          ...prev,
          [curr]: '',
        };
      }, {});
      const error = {
        ...state.error,
        ...errorReset,
        ...validateChat(input)
      };
      const newObj: FormState = {
        input,
        error
      };
      return newObj;
    }
    else if (action.type === 'error') {
      const newObj: FormState = {
        input: {
          ...state.input
        },
        error: {
          ...state.error,
          ...action.values,
        }
      };
      return newObj;
    }

  }

  const [form, setForm] = useReducer(formReducer, {
    input: {
      title: '',
      password: '',
      avatar: null,
    },
    error: {
      title: '',
      password: '',
      avatar: null,
    }
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();


  async function onButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    try {
      const chat = await fetchChatCreate(form.input);
      queryClient.invalidateQueries(['profile', '@me', 'chats']);
      navigate('/chat/'+chat.chatId);
    } catch (err) {
      if (err instanceof NetworkError) {
        setForm({type: 'error', values: err.responseObject});
      }
    }
  } 

  function onAvatarChanged(file: File) {
    if (file) {
      setForm({values: {avatar: file}});
    }
  }

  return (
    <div className="main-window">
      <MainLeftBar />
      <div className="form-window">
        <form>
          <h2>Creating chat</h2>
          <div className="form-container">
            <div className="form-column">
              <DragAndDrop className="image-upload"
                id="avatar"
                inputAsSrc 
                alt="avatar"
                onChanged={(file) => onAvatarChanged(file)}
              ></DragAndDrop>
            </div>
            <div className="form-column">
              <div className="form-row">
                <label htmlFor="chatName">
                  Chat title
                </label>
                <input className={form.error.title ? 'error' : ''}
                  id="chatName"
                  type="text"
                  placeholder="Chat title"
                  value={form.input.title}
                  onChange={(e) => setForm({values: {title: e.target.value}})}
                />
                {form.error.title ? <span className="error">{form.error.title}</span> : <></>}
              </div>
              <div className="form-row">
                <label htmlFor="chatPassword">
                  Chat password
                </label>
                <input className={form.error.password ? 'error' : ''}
                  id="chatPassword"
                  type="password"
                  placeholder="Leave empty for public server"
                  value={form.input.password}
                  onChange={(e) => setForm({values: {password: e.target.value}})}
                />
                {form.error.password ? <span className="error">{form.error.password}</span> : <></>}
              </div>
            </div>
          </div>
          <button onClick={(e) => onButton(e)}>
            Create chat
          </button>
        </form>
      </div>

    </div>
  );
}

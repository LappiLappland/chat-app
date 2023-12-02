import { useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchSignUp } from '../helpers/fetch/auth';
import { NetworkError } from '../helpers/fetch/errors';
import { validateProfile } from '../schemas/profile';
import '../styles/main-form.scss';

interface FormParams {
  email: string,
  nickname: string,
  password: string,
}

interface FormState {
  input: FormParams,
  error: FormParams,
}

interface FormAction {
  type?: 'input' | 'error',
  values: {
    [Property in keyof FormParams]?: string;
  }
}

export default function SignUpPage() {

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
        ...validateProfile(input)
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
      email: '',
      nickname: '',
      password: '',
    },
    error: {
      email: '',
      nickname: '',
      password: '',
    }
  });

  const navigate = useNavigate();

  async function onButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    try {
      await fetchSignUp(form.input);
      navigate('/logIn');
    } catch(err) {
      if (err instanceof NetworkError) {
        setForm({
          type: 'error',
          values: err.responseObject
        });
      }
    }
  }

  return (
    <div className="form-window">
      <form>
        <h1>Sign up</h1>
        <div className="form-row">
          <label htmlFor="email">
            Email
          </label>
          <input className={form.error.email ? 'error' : ''}
            id="email"
            type="email"
            placeholder="Email"
            value={form.input.email}
            onChange={(e) => setForm({values: {email: e.target.value}})}
          />
          {form.error.email ? <span className="error">{form.error.email}</span> : <></>}
        </div>
        <div className="form-row">
          <label htmlFor="nickname">
            Nickname
          </label>
          <input className={form.error.nickname ? 'error' : ''}
            id="nickname"
            type="text"
            placeholder="Nickname"
            value={form.input.nickname}
            onChange={(e) => setForm({values: {nickname: e.target.value}})}
          />
          {form.error.nickname ? <span className="error">{form.error.nickname}</span> : <></>}
        </div>
        <div className="form-row">
          <label htmlFor="chatPassword">
            Password
          </label>
          <input className={form.error.password ? 'error' : ''}
            id="chatPassword"
            type="password"
            placeholder="Password"
            value={form.input.password}
            onChange={(e) => setForm({values: {password: e.target.value}})}
          />
          {form.error.password ? <span className="error">{form.error.password}</span> : <></>}
        </div>
        <span className="suggest">
          Already have an account?
          <Link to="/logIn">Log in.</Link>
        </span>
        <button onClick={(e) => onButton(e)}>
          Sign up
        </button>
      </form>
    </div>
  );
}
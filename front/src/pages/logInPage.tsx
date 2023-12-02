import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import { UnauthorizedError } from '../helpers/fetch/errors';
import '../styles/main-form.scss';


export default function LogInPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { logIn } = useContext(UserContext);
  const navigate = useNavigate();

  async function onButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    try {
      await logIn({email, password});
      setTimeout(() => navigate('/profile/@me'), 5000);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        setError('Email or password is incorrect!');
      }
    }
  }

  return (
    <div className="form-window">
      <form>
        <h1>Login</h1>
        <div className="form-row">
          <label htmlFor="chatName">
            Email
          </label>
          <input 
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {setEmail(e.target.value); setError('');}}
          />
        </div>
        <div className='form-row'>
          <label htmlFor="chatPassword">
            Password
          </label>
          <input 
            id="chatPassword"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {setPassword(e.target.value); setError('');}}
          />
        </div>
        <span className="suggest">
          Don&apos;t have an account?
          <Link to="/signUp">Sign up.</Link>
        </span>
        {error ? <span className="error">{error}</span> : <></>}
        <button onClick={(e) => onButton(e)}>
          Log in
        </button>
      </form>
    </div>
  );
}
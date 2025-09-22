import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUser } from '../../services/slices/user';
import { useDispatch, useSelector } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispath = useDispatch();

  const isLoginRequesting = useSelector(
    (state) => state.user.isLoginRequesting
  );

  const errorText = useSelector((state) => state.user.loginError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isLoginRequesting) {
      dispath(loginUser({ email, password }));
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

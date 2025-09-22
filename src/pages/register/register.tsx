import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUser } from '../../services/slices/user';
import { useDispatch, useSelector } from '../../services/store';

export const Register: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispath = useDispatch();

  const isRegisterRequesting = useSelector(
    (state) => state.user.isRegisterRequesting
  );

  const errorText = useSelector((state) => state.user.registerError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isRegisterRequesting) {
      dispath(registerUser({ name, email, password }));
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setName}
      handleSubmit={handleSubmit}
    />
  );
};

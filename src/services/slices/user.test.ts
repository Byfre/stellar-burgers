import reducer, {
  getUser,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './user';

// Тестовые данные
const mockUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('user reducer async actions', () => {
  const initialState = {
    user: {
      email: '',
      name: ''
    },
    isAuth: false,
    isAuthChecked: false,
    isRegisterRequesting: false,
    registerError: '',
    isLoginRequesting: false,
    loginError: '',
    updateError: ''
  };

  describe('getUser', () => {
    test('при fulfilled сохраняет пользователя и устанавливает авторизацию', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    test('при rejected сбрасывает пользователя и авторизацию', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuth: true
      };

      const action = { type: getUser.rejected.type };
      const state = reducer(stateWithUser, action);

      expect(state.user).toEqual({ email: '', name: '' });
      expect(state.isAuth).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('registerUser', () => {
    test('при pending устанавливает isRegisterRequesting в true и очищает ошибку', () => {
      const stateWithError = {
        ...initialState,
        registerError: 'Предыдущая ошибка'
      };

      const action = { type: registerUser.pending.type };
      const state = reducer(stateWithError, action);

      expect(state.isRegisterRequesting).toBe(true);
      expect(state.registerError).toBe('');
    });

    test('при fulfilled сохраняет пользователя и устанавливает авторизацию', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.isRegisterRequesting).toBe(false);
      expect(state.registerError).toBe('');
    });

    test('при rejected сбрасывает пользователя и сохраняет ошибку', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isRegisterRequesting: true
      };

      const action = { type: registerUser.rejected.type };
      const state = reducer(stateWithUser, action);

      expect(state.user).toEqual({ email: '', name: '' });
      expect(state.isRegisterRequesting).toBe(false);
      expect(state.registerError).toBe(
        'Не удалось зарегистрировать пользователя'
      );
    });
  });

  describe('loginUser', () => {
    test('при pending устанавливает isLoginRequesting в true и сбрасывает авторизацию', () => {
      const action = { type: loginUser.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoginRequesting).toBe(true);
      expect(state.isAuth).toBe(false);
      expect(state.loginError).toBe('');
    });

    test('при fulfilled сохраняет пользователя и устанавливает авторизацию', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.isLoginRequesting).toBe(false);
      expect(state.loginError).toBe('');
    });

    test('при rejected сбрасывает пользователя и сохраняет ошибку', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isLoginRequesting: true
      };

      const action = { type: loginUser.rejected.type };
      const state = reducer(stateWithUser, action);

      expect(state.user).toEqual({ email: '', name: '' });
      expect(state.isAuth).toBe(false);
      expect(state.isLoginRequesting).toBe(false);
      expect(state.loginError).toBe('Не удалось войти');
    });
  });

  describe('updateUser', () => {
    test('при pending очищает ошибку', () => {
      const stateWithError = {
        ...initialState,
        updateError: 'Предыдущая ошибка'
      };

      const action = { type: updateUser.pending.type };
      const state = reducer(stateWithError, action);

      expect(state.updateError).toBe('');
    });

    test('при fulfilled обновляет данные пользователя', () => {
      const updatedUser = {
        email: 'updated@example.com',
        name: 'Updated User'
      };

      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = reducer(initialState, action);

      expect(state.user).toEqual(updatedUser);
      expect(state.updateError).toBe('');
    });

    test('при rejected сохраняет ошибку', () => {
      const action = { type: updateUser.rejected.type };
      const state = reducer(initialState, action);

      expect(state.updateError).toBe('Не удалось обновить данные пользователя');
    });
  });

  describe('logoutUser', () => {
    test('при pending сбрасывает пользователя и авторизацию', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuth: true
      };

      const action = { type: logoutUser.pending.type };
      const state = reducer(stateWithUser, action);

      expect(state.user).toEqual({ email: '', name: '' });
      expect(state.isAuth).toBe(false);
    });

    test('при fulfilled сбрасывает пользователя и авторизацию', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuth: true
      };

      const action = { type: logoutUser.fulfilled.type };
      const state = reducer(stateWithUser, action);

      expect(state.user).toEqual({ email: '', name: '' });
      expect(state.isAuth).toBe(false);
    });
  });
});

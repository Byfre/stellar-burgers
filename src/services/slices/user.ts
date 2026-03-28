import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  type TRegisterData,
  type TLoginData
} from '@api';

import { setCookie, deleteCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser;
  isAuth: boolean;
  isAuthChecked: boolean;
  isRegisterRequesting: boolean;
  registerError: string;

  isLoginRequesting: boolean;
  loginError: string;
  updateError: string;
};

export const initialState: TUserState = {
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

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    setCookie('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    setCookie('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //GetUser
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
      state.isAuthChecked = true;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.user = {
        email: '',
        name: ''
      };
      state.isAuth = false;
      state.isAuthChecked = true;
    });

    //Register
    builder.addCase(registerUser.pending, (state) => {
      state.isRegisterRequesting = true;
      state.registerError = '';
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.registerError = '';
      state.user = action.payload;
      state.isAuth = true;
      state.isRegisterRequesting = false;
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.user = {
        email: '',
        name: ''
      };
      state.isRegisterRequesting = false;
      state.registerError = 'Не удалось зарегистрировать пользователя';
    });

    //UpdateUser
    builder.addCase(updateUser.pending, (state) => {
      state.updateError = '';
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = {
        email: action.payload.email,
        name: action.payload.name
      };
      state.updateError = '';
    });
    builder.addCase(updateUser.rejected, (state) => {
      state.updateError = 'Не удалось обновить данные пользователя';
    });

    //Login
    builder.addCase(loginUser.pending, (state) => {
      state.isAuth = false;
      state.isLoginRequesting = true;
      state.loginError = '';
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loginError = '';
      state.user = action.payload;
      state.isAuth = true;
      state.isLoginRequesting = false;
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.isAuth = false;
      state.user = {
        email: '',
        name: ''
      };
      state.loginError = 'Не удалось войти';
      state.isLoginRequesting = false;
    });

    //Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.user = {
        email: '',
        name: ''
      };
      state.isAuth = false;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = {
        email: '',
        name: ''
      };
      state.isAuth = false;
    });
  }
});

export default userSlice.reducer;

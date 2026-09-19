import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  TRegisterData,
  TLoginData,
  logoutApi
} from '@api';

interface UserState {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  isRegistering: boolean;
  registerError: string | null;
  isUpdatingProfile: boolean;
  profileUpdateError: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: !!getCookie('accessToken'),
  isAuthChecked: !getCookie('accessToken'),
  isLoggingIn: false,
  loginError: null,
  isRegistering: false,
  registerError: null,
  isUpdatingProfile: false,
  profileUpdateError: null
};

export const loginUser = createAsyncThunk<
  { user: TUser },
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return {
      user: response.user
    };
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'message' in err) {
      return rejectWithValue(String(err.message));
    }
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Не удалось войти. Проверьте соединение.');
  }
});

export const registerUser = createAsyncThunk<
  { user: TUser },
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return {
      user: response.user
    };
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'message' in err) {
      return rejectWithValue(String(err.message));
    }
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue(
      'Не удалось зарегистрироваться. Проверьте соединение.'
    );
  }
});

export const updateProfile = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateProfile', async (updates, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(updates);
    return response.user;
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'message' in err) {
      return rejectWithValue(String(err.message));
    }
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue(
      'Не удалось обновить данные профиля. Проверьте соединение.'
    );
  }
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  try {
    const response = await getUserApi();
    return response.user;
  } catch (err) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    throw err;
  }
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoggingIn = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoggingIn = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.loginError = action.payload ?? 'Ошибка входа';
      })
      .addCase(registerUser.pending, (state) => {
        state.isRegistering = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isRegistering = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegistering = false;
        state.registerError = action.payload ?? 'Ошибка регистрации';
      })

      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.profileUpdateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isUpdatingProfile = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.profileUpdateError =
          action.payload ?? 'Ошибка обновления профиля';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      });
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

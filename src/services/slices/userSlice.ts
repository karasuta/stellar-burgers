import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { TUser, TOrder } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import { getOrdersApi, getUserApi } from '@api';

interface userState {
  accessToken: string | null;
  refreshToken: string | null;
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean; //новое
  orders: TOrder[];
  isLoadingOrders: boolean;
  ordersError: string | null;
}

const initialState: userState = {
  accessToken: null,
  refreshToken: localStorage.getItem('refreshToken') ?? null,
  user: null,
  isAuthenticated: !!getCookie('accessToken'),
  isAuthChecked: !getCookie('accessToken'),
  orders: [],
  isLoadingOrders: false,
  ordersError: null
};

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const fetchUserOrders = createAsyncThunk(
  'user/fetchOrders',
  async () => await getOrdersApi()
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: TUser;
      }>
    ) => {
      const { accessToken, refreshToken, user } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuthenticated = true;
      state.isAuthChecked = true; //нов

      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true; //нов
      state.orders = [];

      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoadingOrders = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.ordersError =
          action.error.message ?? 'Не удалось загрузить заказы';
        state.isLoadingOrders = false;
      });
  }
});

export const { login, logout, setUser } = userSlice.actions;
export default userSlice.reducer;

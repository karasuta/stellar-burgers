import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer,
  feed: feedReducer,
  user: userReducer,
  order: orderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export const selectIngredientsItems = (state: RootState) =>
  state.ingredients.items;
export const selectIngredientsIsLoading = (state: RootState) =>
  state.ingredients.isIngredientsLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedLoading = (state: RootState) => state.feed.loading;

export const selectUser = (state: RootState) => state.user.user;

export const selectUserOrders = (state: RootState) => state.order.orders;
export const selectIsLoadingOrders = (state: RootState) =>
  state.order.isLoadingOrders;
export const selectErrorOrders = (state: RootState) => state.order.ordersError;

export const selectOrderByNumber = (state: RootState) =>
  state.order.orderByNumber;
export const selectLoginError = (state: RootState) => state.user.loginError;
export const selectIsLoggingIn = (state: RootState) => state.user.isLoggingIn;
export const selectRegisterError = (state: RootState) =>
  state.user.registerError;
export const selectIsRegistering = (state: RootState) =>
  state.user.isRegistering;
export const selectProfileUpdateError = (state: RootState) =>
  state.user.profileUpdateError;
export const selectIsUpdatingProfile = (state: RootState) =>
  state.user.isUpdatingProfile;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export default store;

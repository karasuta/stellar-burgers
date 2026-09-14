import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer
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

export default store;

import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsSliceReducer from './slices/ingredients';
import feedSliceReducer from './slices/feed';
import orderSliceReducer from './slices/order';
import userSliceReducer from './slices/user';
import userOrdersSliceReducer from './slices/userOrders';

export const rootReducer = () => ({
  ingredients: ingredientsSliceReducer,
  feed: feedSliceReducer,
  order: orderSliceReducer,
  user: userSliceReducer,
  userOrders: userOrdersSliceReducer
});

const store = configureStore({
  reducer: rootReducer(),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

import { configureStore } from '@reduxjs/toolkit';
import  authSlice  from './auth/authSlice';
import { storeToken } from './auth/authStorage';


export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});
store.subscribe(() => storeToken(store.getState().auth.authToken));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

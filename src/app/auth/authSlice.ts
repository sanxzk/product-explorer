import { createSlice } from '@reduxjs/toolkit';
import { readAuthToken } from './authCookie';
import type { User } from '../../types/User';
import { loginUser, logoutUser, restoreSession } from './authThunks';

export type AuthStatus = 'idle' | 'loading' | 'failed';
export type SessionStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous' | 'failed';
const initialAuthToken = readAuthToken();

export interface AuthState {
  authToken: string | null;
  user: User | null;
  status: AuthStatus;
  error: string | null;
  sessionStatus: SessionStatus;
}

const initialState: AuthState = {
  authToken: initialAuthToken,
  user: null,
  status: 'idle',
  error: null,
  sessionStatus: initialAuthToken ? 'idle' : 'anonymous',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    retrySession: (state) => {
      state.sessionStatus = 'idle';
    },
    clearAuthError: (state) => {
      state.error = null;
      if (state.status === 'failed') state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.authToken = action.payload.authToken;
        state.user = action.payload.user;
        state.sessionStatus = 'authenticated';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to sign in. Please try again.';
      })
      .addCase(restoreSession.pending, (state) => {
        state.sessionStatus = 'loading';
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.authToken = action.payload.authToken;
        state.user = action.payload.user;
        state.sessionStatus = 'authenticated';
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.user = null;
        state.authToken = action.payload?.unauthorized ? null : state.authToken;
        state.sessionStatus = action.payload?.unauthorized ? 'anonymous' : 'failed';
        state.error = action.payload?.unauthorized ? null : action.payload?.message ?? 'Unable to restore your session.';
      })
      .addCase(logoutUser.pending, (state) => {
        state.authToken = null;
        state.user = null;
        state.status = 'idle';
        state.error = null;
        state.sessionStatus = 'anonymous';
      });
  },
});

export const { clearAuthError, retrySession } = authSlice.actions;
export default authSlice.reducer;
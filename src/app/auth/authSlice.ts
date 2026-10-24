import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types/User';
import { fetchCurrentUser, loginUser } from './authThunks';
import { getStoredToken } from './authStorage';

export type AuthStatus = 'idle' | 'loading' | 'failed';
export type UserStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AuthState {
  authToken: string | null;
  user: User | null;
  /** login request state */
  status: AuthStatus;
  error: string | null;
  /** /auth/me request state (session restore) */
  userStatus: UserStatus;
}

const initialState: AuthState = {
  authToken: getStoredToken(), // restored from the cookie; user is loaded via /auth/me
  user: null,
  status: 'idle',
  error: null,
  userStatus: 'idle',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.authToken = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.userStatus = 'idle';
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
        state.authToken = action.payload.accessToken;
        state.user = action.payload.user; // login already returns the user, no /me call needed
        state.userStatus = 'succeeded';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to sign in. Please try again.';
      })
      // restore session
      .addCase(fetchCurrentUser.pending, (state) => {
        state.userStatus = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userStatus = 'succeeded';
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.userStatus = 'failed';
        if (action.payload?.unauthorized) {
          // token expired/invalid: end the session (cookie is cleared by store.subscribe)
          state.authToken = null;
          state.user = null;
          state.userStatus = 'idle';
        }
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
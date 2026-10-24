import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getCurrentUser, login } from '../../api/authApi';
import { clearAuthToken, readAuthToken, saveAuthToken } from './authCookie';
import type { LoginCredentials, LoginResult } from '../../types/Auth';
import type { User } from '../../types/User';

interface AuthRootState {
  auth: {
    authToken: string | null;
    sessionStatus: string;
  };
}

interface RestoreSessionError {
  message: string;
  unauthorized: boolean;
}

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const message = (err.response?.data as { message?: unknown } | undefined)?.message;
    return typeof message === 'string' ? message : fallback;
  }
  return err instanceof Error ? err.message : fallback;
};

export const loginUser = createAsyncThunk<LoginResult, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await login(credentials);
      saveAuthToken(result.authToken);
      return result;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Unable to sign in. Please try again.'));
    }
  }
);

export const restoreSession = createAsyncThunk<
  { user: User; authToken: string },
  void,
  { state: AuthRootState; rejectValue: RestoreSessionError }
>(
  'auth/restoreSession',
  async (_, { getState, rejectWithValue }) => {
    const authToken = getState().auth.authToken ?? readAuthToken();
    if (!authToken) {
      clearAuthToken();
      return rejectWithValue({ message: 'No saved session.', unauthorized: true });
    }

    try {
      const user = await getCurrentUser(authToken);
      return { user, authToken };
    } catch (err) {
      const unauthorized =
        axios.isAxiosError(err) && [401, 403].includes(err.response?.status ?? 0);
      if (unauthorized) clearAuthToken();
      return rejectWithValue({
        message: getErrorMessage(err, 'Unable to restore your session.'),
        unauthorized,
      });
    }
  },
  {
    condition: (_, { getState }) =>
      getState().auth.sessionStatus === 'idle',
  }
);

export const logoutUser = createAsyncThunk<void>('auth/logout', async () => {
  clearAuthToken();
});
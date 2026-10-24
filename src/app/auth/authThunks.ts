import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getCurrentUser, login } from '../../api/authApi';
import type { LoginCredentials, LoginResult } from '../../types/Auth';
import type { User } from '../../types/User';

// Minimal state shape, so this file doesn't import the store/slice (avoids a cycle)
type AuthRoot = { auth: { authToken: string | null; userStatus: string } };

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    // dummyjson answers { message: "Invalid credentials" } etc.
    return (err.response?.data as { message?: string } | undefined)?.message ?? fallback;
  }
  return fallback;
};

export const loginUser = createAsyncThunk<
  LoginResult,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await login(credentials);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Unable to sign in. Please try again.'));
  }
});

export interface FetchUserError {
  message: string;
  /** true when the token is missing/expired/invalid, so the session must end */
  unauthorized: boolean;
}

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: FetchUserError }
>(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as AuthRoot).auth.authToken;
    if (!token) return rejectWithValue({ message: 'Not signed in', unauthorized: true });

    try {
      return await getCurrentUser(token);
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      return rejectWithValue({
        message: getErrorMessage(err, 'Unable to load your account.'),
        unauthorized: status === 401 || status === 403,
      });
    }
  },
  {
    // Skip if a request is already running (e.g. React StrictMode double effects)
    condition: (_, { getState }) => (getState() as AuthRoot).auth.userStatus !== 'loading',
  }
);
import axios from 'axios';
import type { LoginCredentials, LoginResponse, LoginResult } from '../types/Auth';
import type { User } from '../types/User';
import { ACCESS_TOKEN_TTL_MINS } from '../app/auth/authStorage';

/**
 * Separate Axios instance for the auth module on purpose:
 * - a wrong password (or an expired token on /auth/me) is handled by the thunks,
 *   not by the global 401 interceptor that logs out and hard-redirects to /login
 * - it avoids an import cycle (store -> slice -> thunk -> apiClient -> store)
 * Everything outside the auth module should keep using apiClient.
 */
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // lets the server set accessToken/refreshToken cookies
});

export const login = async ({ username, password }: LoginCredentials): Promise<LoginResult> => {
  const { data } = await authClient.post<LoginResponse>('/auth/login', {
    username,
    password,
    expiresInMins: ACCESS_TOKEN_TTL_MINS,
  });

  const { accessToken } = data;
  const user: User = {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    image: data.image,
  };
  return { user, accessToken };
};

/** Fetches the logged-in user from the token (used to restore a session after a refresh). */
export const getCurrentUser = async (token: string): Promise<User> => {
  const { data } = await authClient.get<User>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
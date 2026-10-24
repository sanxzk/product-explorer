import type { User } from './User';

export interface LoginCredentials {
  username: string;
  password: string;
}

/** Raw response from POST /auth/login */
export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}

/** What the app actually keeps in Redux */
export interface LoginResult {
  user: User;
  accessToken: string;
}
import type { User } from './User';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  user: User;
  authToken: string;
}
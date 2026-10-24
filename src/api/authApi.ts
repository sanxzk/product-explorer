import type { LoginCredentials } from '../types/Auth';
import type { LoginResponse, LoginResult } from '../types/Auth';
import type { User } from '../types/User';
import apiClient from './apiClient';

export const login = async ({ username, password }: LoginCredentials): Promise<LoginResult> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', {
    username,
    password,
    expiresInMins: 120,
  });

  const {
    id,
    username: userName,
    email,
    firstName,
    lastName,
    gender,
    image,
    accessToken,
  } = data;

  return {
    user: {
      id,
      username: userName,
      email,
      firstName,
      lastName,
      gender,
      image,
    },
    authToken: accessToken,
  };
};

export const getCurrentUser = async (token: string): Promise<User> => {
  const { data } = await apiClient.get<User>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
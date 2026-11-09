import { api } from '../../../shared/api/client';
import type { AuthUser, LoginResponse } from '../model/auth';

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      username: username.trim(), password, expiresInMins: 30,
    });
    return response.data;
  },
  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get<AuthUser>('/auth/me');
    return response.data;
  },
};

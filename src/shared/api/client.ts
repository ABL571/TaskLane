import axios, { type InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens, type AuthTokens } from '../storage/tokenStorage';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com';

export const api = axios.create({ baseURL, timeout: 15000 });
// Separate Axios instance avoids recursive refresh interception while sharing API configuration.
const refreshApi = axios.create({ baseURL, timeout: 15000 });

function expireSession() {
  clearTokens();
  window.dispatchEvent(new Event('tasklane:session-expired'));
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type TokenResponse = AuthTokens;
let refreshPromise: Promise<TokenResponse> | null = null;

api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token && !config.url?.includes('/auth/login')) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config as RetryableConfig | undefined;
    if (error.response?.status !== 401 || !original || original._retry ||
        original.url?.includes('/auth/login') || original.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      expireSession();
      return Promise.reject(error);
    }
    original._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = refreshApi.post<TokenResponse>('/auth/refresh',
          { refreshToken, expiresInMins: 30 })
          .then(response => response.data)
          .finally(() => { refreshPromise = null; });
      }
      const tokens = await refreshPromise;
      setTokens(tokens);
      original.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
      return api(original);
    } catch (refreshError) {
      expireSession();
      return Promise.reject(refreshError);
    }
  },
);

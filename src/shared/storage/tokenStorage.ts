export interface AuthTokens { accessToken: string; refreshToken: string }

// localStorage is explicitly requested in this coding exercise.
// A production authentication system should prefer httpOnly secure cookies.
const ACCESS_KEY = 'tasklane_access_token';
const REFRESH_KEY = 'tasklane_refresh_token';

function read(key: string): string | null {
  try { return localStorage.getItem(key); }
  catch { return null; }
}
export function getAccessToken() { return read(ACCESS_KEY); }
export function getRefreshToken() { return read(REFRESH_KEY); }
export function setTokens(tokens: AuthTokens) {
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}
export function clearTokens() {
  try { localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY); }
  catch { /* Storage may be restricted. */ }
}

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../api/authService';
import { clearTokens, getAccessToken, setTokens } from '../../../shared/storage/tokenStorage';
import type { AuthUser } from '../model/auth';

interface AuthContextValue {
  user: AuthUser | null;
  initializing: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;
    const onExpired = () => setUser(null);
    window.addEventListener('tasklane:session-expired', onExpired);
    if (!getAccessToken()) {
      setInitializing(false);
    } else {
      authService.getCurrentUser()
        .then(data => { if (active) setUser(data); })
        .catch(() => { if (active) { clearTokens(); setUser(null); } })
        .finally(() => { if (active) setInitializing(false); });
    }
    return () => { active = false; window.removeEventListener('tasklane:session-expired', onExpired); };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const data = await authService.login(username, password);
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    const { accessToken: _access, refreshToken: _refresh, ...userData } = data;
    // The API response contains tokens alongside the user; keep only public user fields in state.
    void _access;
    void _refresh;
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, initializing, login, logout }), [user, initializing, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


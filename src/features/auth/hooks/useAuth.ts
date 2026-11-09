import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be called inside AuthProvider');
  return value;
}

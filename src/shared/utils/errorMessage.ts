import axios from 'axios';

export function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return 'An unexpected error occurred. Please try again.';
  if (!error.response) return 'Network connection failed. Check your internet and try again.';
  const status = error.response.status;
  if (status === 401) return 'Invalid credentials or your session has expired.';
  if (status === 403) return 'Access denied. Your account is not authorized.';
  if (status >= 500) return 'Server is currently unavailable. Please try again shortly.';
  const message = (error.response.data as { message?: unknown })?.message;
  return typeof message === 'string' ? message : 'The request could not be completed.';
}

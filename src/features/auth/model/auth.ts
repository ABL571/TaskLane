import type { AuthTokens } from '../../../shared/storage/tokenStorage';

/** Shape returned by DummyJSON /auth/me. */
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

export type LoginResponse = AuthUser & AuthTokens;

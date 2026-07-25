import { UserRole } from './constants';

/* ── Auth shared types ───────────────────────────────────── */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

/* ── gRPC metadata keys ──────────────────────────────────── */
export const GRPC_METADATA = {
  USER_ID: 'x-user-id',
  USER_EMAIL: 'x-user-email',
  USER_ROLE: 'x-user-role',
  USER_NAME: 'x-user-name',
  INTERNAL_KEY: 'x-internal-key',
  CORRELATION_ID: 'x-correlation-id',
} as const;

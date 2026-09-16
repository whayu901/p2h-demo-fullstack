import type { PenggunaProfil } from '@p2h/shared';

/**
 * Augments Express' Request with the fields our middleware/guards attach:
 * `pengguna` by AuthGuard (see src/auth/auth.guard.ts), `requestId` by
 * RequestIdMiddleware (see src/common/logging/request-id.middleware.ts).
 */
declare global {
  namespace Express {
    interface Request {
      pengguna?: PenggunaProfil;
      requestId?: string;
    }
  }
}

export {};

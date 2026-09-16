import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { PenggunaProfil } from '@p2h/shared';

/** Reads the current user populated by AuthGuard. Throws if the guard isn't wired up (it's global, so this should never happen). */
export const PenggunaSaatIni = createParamDecorator((_data: unknown, ctx: ExecutionContext): PenggunaProfil => {
  const request = ctx.switchToHttp().getRequest<Request>();
  if (!request.pengguna) {
    throw new Error('AuthGuard belum mengisi request.pengguna — pastikan guard terpasang secara global.');
  }
  return request.pengguna;
});

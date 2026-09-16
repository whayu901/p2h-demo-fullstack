import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { bolehMelakukan, type Aksi } from '@p2h/shared';
import { BUTUH_AKSI_KEY } from './butuh.decorator';

/**
 * Global guard (registered via APP_GUARD, after AuthGuard). Only enforces
 * anything on handlers annotated with @Butuh(aksi) — everything else passes
 * through untouched, which is what keeps every un-annotated endpoint working
 * exactly as before. Delegates the actual yes/no to `bolehMelakukan` from
 * @p2h/shared — the permission table itself is never duplicated here.
 */
@Injectable()
export class PeranGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const aksi = this.reflector.getAllAndOverride<Aksi | undefined>(BUTUH_AKSI_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!aksi) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const pengguna = request.pengguna;
    if (!pengguna || !bolehMelakukan(pengguna.peran, aksi)) {
      throw new ForbiddenException(`Anda tidak memiliki izin untuk melakukan aksi "${aksi}"`);
    }
    return true;
  }
}

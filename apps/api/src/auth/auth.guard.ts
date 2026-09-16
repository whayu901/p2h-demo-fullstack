import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { PERAN, type PenggunaProfil } from '@p2h/shared';
import { getAppConfig } from '../config/app-config';
import { AuthService } from './auth.service';
import { parsePeranHeader } from './peran.util';

export const DEMO_PERAN_HEADER = 'x-demo-peran';

/**
 * Global guard (registered via APP_GUARD). When AUTH_ENABLED=false (default),
 * every request is allowed and a demo user is injected so the existing demo
 * flow keeps working unauthenticated — its roles come from the optional
 * X-Demo-Peran header, defaulting to every role. When AUTH_ENABLED=true, a
 * valid bearer token is required.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const config = getAppConfig();

    if (!config.auth.enabled) {
      request.pengguna = buildDemoUser(request.header(DEMO_PERAN_HEADER));
      return true;
    }

    const authorization = request.header('authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : null;
    if (!token) {
      throw new UnauthorizedException('Token otorisasi tidak ditemukan');
    }
    request.pengguna = await this.authService.verifikasiToken(token);
    return true;
  }
}

function buildDemoUser(demoPeranHeader: string | undefined): PenggunaProfil {
  const requested = parsePeranHeader(demoPeranHeader);
  const peran = requested.length > 0 ? requested : [...PERAN];
  return {
    id: 'demo-user',
    nama: 'Pengguna Demo',
    nrp: '00.00.0000',
    email: null,
    jabatan: null,
    peran,
  };
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify, type JWTPayload, type JWTVerifyGetKey } from 'jose';
import type { PenggunaProfil } from '@p2h/shared';
import { getAppConfig } from '../config/app-config';
import { normalizePeranList } from './peran.util';

/**
 * Verifies bearer tokens and maps their claims to our domain `PenggunaProfil`.
 * Two verification modes, chosen by config:
 *  - AUTH_JWKS_URL set: remote JWKS (OIDC, e.g. Entra ID) — production mode.
 *  - otherwise: HS256 with AUTH_DEV_SECRET — local/dev tokens only.
 */
@Injectable()
export class AuthService {
  private remoteJwks: JWTVerifyGetKey | null = null;

  async verifikasiToken(token: string): Promise<PenggunaProfil> {
    const config = getAppConfig();
    try {
      const payload = config.auth.jwksUrl
        ? await this.verifyWithJwks(token, config.auth.jwksUrl, config.auth.issuer, config.auth.audience)
        : await this.verifyWithDevSecret(token, config.auth.devSecret, config.auth.issuer, config.auth.audience);
      return this.toPenggunaProfil(payload);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Token otorisasi tidak valid atau sudah kedaluwarsa');
    }
  }

  private async verifyWithJwks(
    token: string,
    jwksUrl: string,
    issuer: string | null,
    audience: string | null,
  ): Promise<JWTPayload> {
    if (!this.remoteJwks) {
      this.remoteJwks = createRemoteJWKSet(new URL(jwksUrl));
    }
    const { payload } = await jwtVerify(token, this.remoteJwks, {
      issuer: issuer ?? undefined,
      audience: audience ?? undefined,
    });
    return payload;
  }

  private async verifyWithDevSecret(
    token: string,
    secret: string,
    issuer: string | null,
    audience: string | null,
  ): Promise<JWTPayload> {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key, {
      issuer: issuer ?? undefined,
      audience: audience ?? undefined,
      algorithms: ['HS256'],
    });
    return payload;
  }

  private toPenggunaProfil(payload: JWTPayload): PenggunaProfil {
    // TODO(client IdP integration): this demo/dev mapping expects a `peran` claim
    // holding our own Peran[] values directly, falling back to a generic `roles`
    // or `groups` claim. The client's real IdP (Entra ID) will most likely expose
    // *group object IDs* instead of role names — replace this block with a lookup
    // table (Entra group id -> Peran) once that configuration is known.
    const claimPeran = payload['peran'] ?? payload['roles'] ?? payload['groups'];
    const peran = normalizePeranList(claimPeran);
    if (peran.length === 0) {
      throw new UnauthorizedException('Token tidak memiliki peran yang valid');
    }

    const sub = typeof payload.sub === 'string' ? payload.sub : 'unknown';
    const nama = typeof payload['nama'] === 'string' ? (payload['nama'] as string) : sub;
    const nrp = typeof payload['nrp'] === 'string' ? (payload['nrp'] as string) : sub;
    const email = typeof payload['email'] === 'string' ? (payload['email'] as string) : null;

    return { id: sub, nama, nrp, email, jabatan: null, peran };
  }
}

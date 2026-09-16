import type { Peran } from './peran';

/** Authenticated user profile as exposed by the API to the dashboard/mobile app. */
export interface PenggunaProfil {
  id: string;
  nama: string;
  nrp: string;
  email: string | null;
  jabatan: string | null;
  peran: Peran[];
}

/** Claims the API expects in a bearer token (OIDC-compatible subset). */
export interface KlaimToken {
  sub: string;
  nama: string;
  nrp: string;
  email?: string;
  peran: Peran[];
  /** Expiry, seconds since epoch (standard JWT `exp`). */
  exp?: number;
}

/** Response for the "who am I" session endpoint. */
export interface SesiResponse {
  pengguna: PenggunaProfil;
  /** false → demo mode, API auth disabled; every request is allowed. */
  authAktif: boolean;
}

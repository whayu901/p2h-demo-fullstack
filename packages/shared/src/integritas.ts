/** Evidence integrity checks attached to a submitted inspection/safety talk record. */

/** GPS integrity for a submitted record. */
export interface IntegritasLokasi {
  /** Android reports mocked locations; true = fake GPS app suspected. */
  mock: boolean;
  akurasiMeter: number | null;
}

/** Clock integrity comparing device time against server time at submission. */
export interface IntegritasWaktu {
  /** ISO 8601 timestamp reported by the device. */
  waktuPerangkat: string;
  /** ISO 8601 timestamp recorded by the server. */
  waktuServer: string;
  selisihDetik: number;
  mencurigakan: boolean;
}

/** Beyond this skew, device/server clock drift is flagged as suspicious. */
export const TOLERANSI_SELISIH_WAKTU_DETIK = 300;

/** Compares device and server timestamps and flags suspicious clock drift. */
export function evaluasiIntegritasWaktu(
  waktuPerangkat: string,
  waktuServer: string,
  toleransiDetik: number = TOLERANSI_SELISIH_WAKTU_DETIK,
): IntegritasWaktu {
  const selisihMs = new Date(waktuServer).getTime() - new Date(waktuPerangkat).getTime();
  const selisihDetik = Math.round(Math.abs(selisihMs) / 1000);
  return {
    waktuPerangkat,
    waktuServer,
    selisihDetik,
    mencurigakan: selisihDetik > toleransiDetik,
  };
}

/** Full integrity record persisted alongside an inspection/safety talk. */
export interface IntegritasRecord {
  lokasi: IntegritasLokasi | null;
  waktu: IntegritasWaktu | null;
  /** SHA-256 of the record payload, computed server-side. */
  hashRecord: string | null;
}

/** True if the record shows a mocked GPS location or a suspicious clock skew. */
export function adaMasalahIntegritas(integritas: IntegritasRecord | null): boolean {
  if (!integritas) return false;
  return Boolean(integritas.lokasi?.mock) || Boolean(integritas.waktu?.mencurigakan);
}

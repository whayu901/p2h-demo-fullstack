import { RETENSI_SERVER_HARI_DEFAULT } from '@p2h/shared';

export type DbType = 'better-sqlite3' | 'postgres';
export type StorageDriver = 'local' | 's3';

export interface AppConfig {
  auth: {
    /** Off by default — the demo must keep working unauthenticated. */
    enabled: boolean;
    /** OIDC JWKS endpoint (e.g. Entra ID). When set, tokens are verified against it. */
    jwksUrl: string | null;
    issuer: string | null;
    audience: string | null;
    /** HS256 secret used to verify local/dev tokens when AUTH_JWKS_URL is not set. */
    devSecret: string;
  };
  db: {
    type: DbType;
    host: string;
    port: number;
    user: string;
    password: string;
    /**
     * Postgres: database name. Sqlite: optional override of the database file
     * path (or ':memory:'), used by tests/tooling; empty means "use the
     * default demo path" (apps/api/data/demo.sqlite).
     */
    name: string;
    synchronize: boolean;
  };
  storage: {
    driver: StorageDriver;
    s3: {
      bucket: string | null;
      region: string | null;
      accessKeyId: string | null;
      secretAccessKey: string | null;
      endpoint: string | null;
    };
  };
  retention: {
    serverDays: number;
    /** Off by default — the demo never auto-deletes data. */
    cronEnabled: boolean;
  };
  integration: {
    /** Empty = disabled; no webhook is ever called. */
    webhookUrl: string | null;
  };
}

function readBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  return raw === 'true' || raw === '1';
}

function readInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readStr(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

function readOptionalStr(name: string): string | null {
  const raw = process.env[name];
  return raw ? raw : null;
}

let cached: AppConfig | null = null;

/** Reads every env var once and caches the typed result; env vars are passed by the shell (no dotenv). */
export function getAppConfig(): AppConfig {
  if (cached) return cached;

  const dbType = readStr('DB_TYPE', 'better-sqlite3') as DbType;
  const isPostgres = dbType === 'postgres';

  cached = {
    auth: {
      enabled: readBool('AUTH_ENABLED', false),
      jwksUrl: readOptionalStr('AUTH_JWKS_URL'),
      issuer: readOptionalStr('AUTH_ISSUER'),
      audience: readOptionalStr('AUTH_AUDIENCE'),
      devSecret: readStr('AUTH_DEV_SECRET', 'ubah-rahasia-ini-sebelum-produksi'),
    },
    db: {
      type: dbType,
      host: readStr('DB_HOST', 'localhost'),
      port: readInt('DB_PORT', 5432),
      user: readStr('DB_USER', 'postgres'),
      password: readStr('DB_PASSWORD', ''),
      name: readStr('DB_NAME', isPostgres ? 'p2h' : ''),
      // sqlite demo: convenient auto-sync. Postgres: always false — schema changes
      // must go through TypeORM migrations (see src/database).
      synchronize: isPostgres ? false : readBool('DB_SYNCHRONIZE', true),
    },
    storage: {
      driver: readStr('STORAGE_DRIVER', 'local') as StorageDriver,
      s3: {
        bucket: readOptionalStr('S3_BUCKET'),
        region: readOptionalStr('S3_REGION'),
        accessKeyId: readOptionalStr('S3_ACCESS_KEY_ID'),
        secretAccessKey: readOptionalStr('S3_SECRET_ACCESS_KEY'),
        endpoint: readOptionalStr('S3_ENDPOINT'),
      },
    },
    retention: {
      serverDays: readInt('RETENTION_SERVER_DAYS', RETENSI_SERVER_HARI_DEFAULT),
      cronEnabled: readBool('RETENTION_CRON_ENABLED', false),
    },
    integration: {
      webhookUrl: readOptionalStr('INTEGRATION_WEBHOOK_URL'),
    },
  };

  return cached;
}

/** Test-only: clears the cached config so the next getAppConfig() re-reads process.env. */
export function resetAppConfigCacheForTests(): void {
  cached = null;
}

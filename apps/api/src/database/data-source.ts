import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { getAppConfig } from '../config/app-config';
import { resolveSqliteDatabasePath } from '../common/paths.util';
import { UnitEntity } from '../units/unit.entity';
import { InspectionEntity } from '../inspections/inspection.entity';
import { SafetyTalkEntity } from '../safety-talks/safety-talk.entity';
import { AuditEntity } from '../audit/audit.entity';
import { SystemMetaEntity } from '../pdp/system-meta.entity';

const config = getAppConfig();
const entities = [UnitEntity, InspectionEntity, SafetyTalkEntity, AuditEntity, SystemMetaEntity];

/**
 * CLI DataSource for `npm run migration:generate` / `migration:run` (see
 * package.json). Mirrors the entities registered in AppModule.
 * `synchronize` is never set here — migrations are the source of truth for
 * schema changes outside the sqlite demo, where AppModule's synchronize:true
 * is a deliberate, documented shortcut (see app-config.ts / app.module.ts).
 */
const options: DataSourceOptions =
  config.db.type === 'postgres'
    ? {
        type: 'postgres',
        host: config.db.host,
        port: config.db.port,
        username: config.db.user,
        password: config.db.password,
        database: config.db.name,
        entities,
        migrations: ['src/database/migrations/*.ts'],
      }
    : {
        type: 'better-sqlite3',
        database: resolveSqliteDatabasePath(config.db.name),
        entities,
        migrations: ['src/database/migrations/*.ts'],
      };

export const AppDataSource = new DataSource(options);

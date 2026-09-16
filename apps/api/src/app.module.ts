import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { getAppConfig } from './config/app-config';
import { resolveSqliteDatabasePath } from './common/paths.util';
import { RequestIdMiddleware } from './common/logging/request-id.middleware';
import { UnitEntity } from './units/unit.entity';
import { InspectionEntity } from './inspections/inspection.entity';
import { SafetyTalkEntity } from './safety-talks/safety-talk.entity';
import { AuditEntity } from './audit/audit.entity';
import { SystemMetaEntity } from './pdp/system-meta.entity';
import { AuthModule } from './auth/auth.module';
import { UnitsModule } from './units/units.module';
import { InspectionsModule } from './inspections/inspections.module';
import { SafetyTalksModule } from './safety-talks/safety-talks.module';
import { SyncModule } from './sync/sync.module';
import { OverviewModule } from './overview/overview.module';
import { HealthModule } from './health/health.module';
import { PhotosModule } from './photos/photos.module';
import { SeedModule } from './seed/seed.module';
import { AdminModule } from './admin/admin.module';
import { AuditModule } from './audit/audit.module';
import { TandaTanganModule } from './tanda-tangan/tanda-tangan.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { PdpModule } from './pdp/pdp.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: buildTypeOrmOptions }),
    // ScheduleModule is only wired up when retention's cron job should actually run
    // (RETENTION_CRON_ENABLED=true) — see RetentionService for why that's enough.
    ...(getAppConfig().retention.cronEnabled ? [ScheduleModule.forRoot()] : []),
    AuthModule,
    UnitsModule,
    InspectionsModule,
    SafetyTalksModule,
    SyncModule,
    OverviewModule,
    HealthModule,
    PhotosModule,
    SeedModule,
    AdminModule,
    AuditModule,
    TandaTanganModule,
    IntegrationsModule,
    PdpModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}

/** Builds TypeORM connection options for the demo sqlite path or a configured postgres instance. */
function buildTypeOrmOptions(): TypeOrmModuleOptions {
  const config = getAppConfig();
  const entities = [UnitEntity, InspectionEntity, SafetyTalkEntity, AuditEntity, SystemMetaEntity];

  if (config.db.type === 'postgres') {
    return {
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.user,
      password: config.db.password,
      database: config.db.name,
      entities,
      // Postgres never uses synchronize — schema changes go through TypeORM migrations (src/database).
      synchronize: config.db.synchronize,
    };
  }

  return {
    type: 'better-sqlite3',
    database: resolveSqliteDatabasePath(config.db.name),
    entities,
    // Demo only: keeps the schema in sync with the entities without migrations.
    synchronize: config.db.synchronize,
  };
}

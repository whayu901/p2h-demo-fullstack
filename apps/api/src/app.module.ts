import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mkdirSync } from 'node:fs';
import { DATA_DIR, DB_PATH } from './common/paths.util';
import { UnitEntity } from './units/unit.entity';
import { InspectionEntity } from './inspections/inspection.entity';
import { SafetyTalkEntity } from './safety-talks/safety-talk.entity';
import { UnitsModule } from './units/units.module';
import { InspectionsModule } from './inspections/inspections.module';
import { SafetyTalksModule } from './safety-talks/safety-talks.module';
import { SyncModule } from './sync/sync.module';
import { OverviewModule } from './overview/overview.module';
import { HealthModule } from './health/health.module';
import { PhotosModule } from './photos/photos.module';
import { SeedModule } from './seed/seed.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ensureDatabasePath(),
      entities: [UnitEntity, InspectionEntity, SafetyTalkEntity],
      // Demo only: keeps the schema in sync with the entities without migrations.
      synchronize: true,
    }),
    UnitsModule,
    InspectionsModule,
    SafetyTalksModule,
    SyncModule,
    OverviewModule,
    HealthModule,
    PhotosModule,
    SeedModule,
    AdminModule,
  ],
})
export class AppModule {}

/** Ensures the sqlite data directory exists before TypeORM tries to open the file. */
function ensureDatabasePath(): string {
  mkdirSync(DATA_DIR, { recursive: true });
  return DB_PATH;
}

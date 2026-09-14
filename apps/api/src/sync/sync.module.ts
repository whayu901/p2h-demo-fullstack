import { Module } from '@nestjs/common';
import { UnitsModule } from '../units/units.module';
import { InspectionsModule } from '../inspections/inspections.module';
import { SafetyTalksModule } from '../safety-talks/safety-talks.module';
import { PhotosModule } from '../photos/photos.module';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';

@Module({
  imports: [UnitsModule, InspectionsModule, SafetyTalksModule, PhotosModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}

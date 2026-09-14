import { Module } from '@nestjs/common';
import { InspectionsModule } from '../inspections/inspections.module';
import { SafetyTalksModule } from '../safety-talks/safety-talks.module';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';

@Module({
  imports: [InspectionsModule, SafetyTalksModule],
  controllers: [OverviewController],
  providers: [OverviewService],
})
export class OverviewModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitEntity } from '../units/unit.entity';
import { InspectionEntity } from '../inspections/inspection.entity';
import { SafetyTalkEntity } from '../safety-talks/safety-talk.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitEntity, InspectionEntity, SafetyTalkEntity])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

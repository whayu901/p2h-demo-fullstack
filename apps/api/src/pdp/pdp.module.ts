import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionEntity } from '../inspections/inspection.entity';
import { SafetyTalkEntity } from '../safety-talks/safety-talk.entity';
import { AuditModule } from '../audit/audit.module';
import { PhotosModule } from '../photos/photos.module';
import { SystemMetaEntity } from './system-meta.entity';
import { RetentionService } from './retention.service';
import { PdpService } from './pdp.service';
import { PdpController } from './pdp.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([InspectionEntity, SafetyTalkEntity, SystemMetaEntity]),
    AuditModule,
    PhotosModule,
  ],
  controllers: [PdpController],
  providers: [PdpService, RetentionService],
  exports: [RetentionService],
})
export class PdpModule {}

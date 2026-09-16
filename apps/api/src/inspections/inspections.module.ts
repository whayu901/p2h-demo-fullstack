import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from '../audit/audit.module';
import { TandaTanganModule } from '../tanda-tangan/tanda-tangan.module';
import { InspectionEntity } from './inspection.entity';
import { InspectionsService } from './inspections.service';
import { InspectionsController } from './inspections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InspectionEntity]), AuditModule, TandaTanganModule],
  controllers: [InspectionsController],
  providers: [InspectionsService],
  exports: [InspectionsService],
})
export class InspectionsModule {}

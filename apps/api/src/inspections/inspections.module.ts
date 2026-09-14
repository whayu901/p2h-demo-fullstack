import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionEntity } from './inspection.entity';
import { InspectionsService } from './inspections.service';
import { InspectionsController } from './inspections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InspectionEntity])],
  controllers: [InspectionsController],
  providers: [InspectionsService],
  exports: [InspectionsService],
})
export class InspectionsModule {}

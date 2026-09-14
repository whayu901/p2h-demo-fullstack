import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionsModule } from '../inspections/inspections.module';
import { UnitEntity } from './unit.entity';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnitEntity]), InspectionsModule],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}

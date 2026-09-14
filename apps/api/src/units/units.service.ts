import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Unit, UnitDenganStatus } from '@p2h/shared';
import { InspectionsService } from '../inspections/inspections.service';
import type { InspectionEntity } from '../inspections/inspection.entity';
import { UnitEntity } from './unit.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(UnitEntity)
    private readonly unitsRepository: Repository<UnitEntity>,
    private readonly inspectionsService: InspectionsService,
  ) {}

  async findAll(): Promise<Unit[]> {
    return this.unitsRepository.find({ order: { code: 'ASC' } });
  }

  async findAllWithStatus(): Promise<UnitDenganStatus[]> {
    const units = await this.unitsRepository.find({ order: { code: 'ASC' } });
    const latestByUnitId = await this.inspectionsService.findLatestPerUnit();
    return units.map((unit) => ({
      ...unit,
      inspeksiTerakhir: toInspeksiTerakhir(latestByUnitId.get(unit.id)),
    }));
  }

  async countUnits(): Promise<number> {
    return this.unitsRepository.count();
  }

  async findById(id: string): Promise<UnitEntity | null> {
    return this.unitsRepository.findOneBy({ id });
  }
}

function toInspeksiTerakhir(entity: InspectionEntity | undefined): UnitDenganStatus['inspeksiTerakhir'] {
  if (!entity) {
    return null;
  }
  return {
    tanggal: entity.tanggal,
    statusKelayakan: entity.statusKelayakan,
    namaOperator: entity.namaOperator,
  };
}

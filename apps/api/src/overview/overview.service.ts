import { Injectable } from '@nestjs/common';
import type { OverviewResponse, RecentSubmission } from '@p2h/shared';
import { InspectionsService } from '../inspections/inspections.service';
import type { InspectionEntity } from '../inspections/inspection.entity';
import { SafetyTalksService } from '../safety-talks/safety-talks.service';
import type { SafetyTalkEntity } from '../safety-talks/safety-talk.entity';

const RECENT_LIMIT = 10;

@Injectable()
export class OverviewService {
  constructor(
    private readonly inspectionsService: InspectionsService,
    private readonly safetyTalksService: SafetyTalksService,
  ) {}

  async getOverview(): Promise<OverviewResponse> {
    const [inspectionStats, p5mHariIni, recentInspections, recentSafetyTalks, menungguTindakLanjut] =
      await Promise.all([
        this.inspectionsService.getTodayStats(),
        this.safetyTalksService.countToday(),
        this.inspectionsService.findRecent(RECENT_LIMIT),
        this.safetyTalksService.findRecent(RECENT_LIMIT),
        this.inspectionsService.countMenungguTindakLanjut(),
      ]);

    const recent = [...recentInspections.map(toInspectionRecent), ...recentSafetyTalks.map(toSafetyTalkRecent)]
      .sort((a, b) => (a.dibuatPada < b.dibuatPada ? 1 : -1))
      .slice(0, RECENT_LIMIT);

    return {
      stats: {
        p2hHariIni: inspectionStats.p2hHariIni,
        p5mHariIni,
        unitStopOperasi: inspectionStats.unitStopOperasi,
        temuanTerbuka: inspectionStats.temuanTerbuka,
        menungguTindakLanjut,
      },
      recent,
    };
  }
}

function toInspectionRecent(entity: InspectionEntity): RecentSubmission {
  return {
    kind: 'P2H',
    id: entity.id,
    judul: `${entity.unit.code} — ${entity.unit.name}`,
    petugas: entity.namaOperator,
    tanggal: entity.tanggal,
    dibuatPada: entity.dibuatPada,
    statusKelayakan: entity.statusKelayakan,
  };
}

function toSafetyTalkRecent(entity: SafetyTalkEntity): RecentSubmission {
  return {
    kind: 'P5M',
    id: entity.id,
    judul: entity.topik,
    petugas: entity.namaPemimpin,
    tanggal: entity.tanggal,
    dibuatPada: entity.dibuatPada,
    statusKelayakan: null,
  };
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  API_ROUTES,
  type InspectionFilters,
  type InspectionView,
  type KirimKeputusanDto,
  type KirimRekomendasiDto,
  type PenggunaProfil,
} from '@p2h/shared';
import { Butuh } from '../auth/butuh.decorator';
import { PenggunaSaatIni } from '../auth/pengguna-saat-ini.decorator';
import { InspectionsService } from './inspections.service';

@Controller(API_ROUTES.inspections)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Butuh('inspeksi:baca')
  @Get()
  async findAll(@Query() filters: InspectionFilters): Promise<InspectionView[]> {
    return this.inspectionsService.findAll(filters);
  }

  @Butuh('inspeksi:baca')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InspectionView> {
    return this.inspectionsService.findByIdOrThrow(id);
  }

  @Butuh('inspeksi:rekomendasi')
  @Post(':id/rekomendasi')
  async tambahRekomendasi(
    @Param('id') id: string,
    @Body() dto: KirimRekomendasiDto,
    @PenggunaSaatIni() pengguna: PenggunaProfil,
  ): Promise<InspectionView> {
    return this.inspectionsService.tambahRekomendasi(id, dto, pengguna);
  }

  @Butuh('inspeksi:keputusan')
  @Post(':id/keputusan')
  async tambahKeputusan(
    @Param('id') id: string,
    @Body() dto: KirimKeputusanDto,
    @PenggunaSaatIni() pengguna: PenggunaProfil,
  ): Promise<InspectionView> {
    return this.inspectionsService.tambahKeputusan(id, dto, pengguna);
  }
}

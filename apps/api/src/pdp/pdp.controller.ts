import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  API_ROUTES,
  type HasilPenghapusanPdp,
  type KebijakanRetensi,
  type PenggunaProfil,
  type PermintaanPdpDto,
  type RingkasanDataPribadi,
} from '@p2h/shared';
import { Butuh } from '../auth/butuh.decorator';
import { PenggunaSaatIni } from '../auth/pengguna-saat-ini.decorator';
import { PdpService } from './pdp.service';

@Controller()
export class PdpController {
  constructor(private readonly pdpService: PdpService) {}

  @Butuh('pdp:kelola')
  @Get(API_ROUTES.kebijakanRetensi)
  async retensi(): Promise<KebijakanRetensi> {
    return this.pdpService.kebijakanRetensi();
  }

  @Butuh('pdp:kelola')
  @Post(API_ROUTES.pdp)
  async proses(
    @Body() dto: PermintaanPdpDto,
    @PenggunaSaatIni() pengguna: PenggunaProfil,
  ): Promise<RingkasanDataPribadi | HasilPenghapusanPdp> {
    return this.pdpService.proses(dto, pengguna);
  }
}

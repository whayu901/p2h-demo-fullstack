import { Controller, Get } from '@nestjs/common';
import { API_ROUTES, type PenggunaProfil, type SesiResponse } from '@p2h/shared';
import { getAppConfig } from '../config/app-config';
import { PenggunaSaatIni } from './pengguna-saat-ini.decorator';

@Controller()
export class AuthController {
  @Get(API_ROUTES.sesi)
  sesi(@PenggunaSaatIni() pengguna: PenggunaProfil): SesiResponse {
    return { pengguna, authAktif: getAppConfig().auth.enabled };
  }
}

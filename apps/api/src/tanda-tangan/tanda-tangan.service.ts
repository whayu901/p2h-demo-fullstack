import { Injectable } from '@nestjs/common';
import type { PenggunaProfil, TandaTanganElektronik } from '@p2h/shared';
import { hashCanonicalPayload } from '../common/canonical-json.util';
import type { PenyediaTandaTangan } from './penyedia-tanda-tangan.interface';

/** Demo implementation of PenyediaTandaTangan: a hash of the payload, not a certified signature. */
@Injectable()
export class TandaTanganService implements PenyediaTandaTangan {
  tandaTangani(payload: unknown, pengguna: PenggunaProfil): TandaTanganElektronik {
    return {
      jenis: 'DEMO_HASH',
      penandaTanganId: pengguna.id,
      nama: pengguna.nama,
      nrp: pengguna.nrp,
      pada: new Date().toISOString(),
      hashDokumen: hashCanonicalPayload(payload),
      sertifikatId: null,
      penerbit: null,
    };
  }
}

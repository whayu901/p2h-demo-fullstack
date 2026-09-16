import type { PenggunaProfil, TandaTanganElektronik } from '@p2h/shared';

/**
 * TODO: implementasi PSrE tersertifikasi (UU ITE Pasal 11, PP 71/2019,
 * Permenkomdigi 11/2022). Provider produksi akan memanggil API PSrE
 * berizin (mis. Peruri, PrivyID, VIDA) untuk menghasilkan tanda tangan
 * elektronik tersertifikasi — bukan sekadar hash dokumen seperti pada
 * `TandaTanganService` (mode demo). Ganti provider dengan mengimplementasikan
 * interface ini dan menukar binding di TandaTanganModule.
 */
export interface PenyediaTandaTangan {
  tandaTangani(
    payload: unknown,
    pengguna: PenggunaProfil,
  ): Promise<TandaTanganElektronik> | TandaTanganElektronik;
}

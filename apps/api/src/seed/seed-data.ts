import type { HasilItemValue, Shift } from '@p2h/shared';

/** A checklist item override; anything not listed here defaults to NORMAL. */
export interface SeedItemOverride {
  key: string;
  hasil: HasilItemValue;
  keterangan?: string;
}

/** Static shape of a seeded P2H inspection; dates/timestamps are computed relative to boot time. */
export interface SeedInspectionTemplate {
  id: string;
  unitId: string;
  namaOperator: string;
  nrp: string;
  shift: Shift;
  /** How long ago (in hours, relative to boot time) this inspection took place. */
  hoursAgo: number;
  lokasiKerja: string;
  hmKmAwal: number;
  hmKmAkhir: number;
  catatanOperator: string;
  latitude: number;
  longitude: number;
  overrides: SeedItemOverride[];
}

/** Static shape of a seeded P5M safety talk; dates/timestamps are computed relative to boot time. */
export interface SeedSafetyTalkTemplate {
  id: string;
  topik: string;
  namaPemimpin: string;
  nrpPemimpin: string;
  jamMulai: string;
  shift: Shift;
  lokasiArea: string;
  departemenRegu: string;
  /** How long ago (in hours, relative to boot time) this talk was held. */
  hoursAgo: number;
  uraianSingkat: string;
  potensiBahaya: string[];
  komitmenPengendalian: string[];
  informasiPengumuman: string;
  peserta: { nama: string; nrp: string; hadir: boolean }[];
  catatan: string;
  latitude: number;
  longitude: number;
}

const DT_014 = '9c1f0b0a-0001-4a4e-8c1a-000000000001';
const DT_021 = '9c1f0b0a-0001-4a4e-8c1a-000000000002';
const EX_207 = '9c1f0b0a-0002-4a4e-8c1a-000000000003';
const EX_212 = '9c1f0b0a-0002-4a4e-8c1a-000000000004';
const LV_032 = '9c1f0b0a-0003-4a4e-8c1a-000000000005';
const GS_005 = '9c1f0b0a-0004-4a4e-8c1a-000000000007';

/**
 * 12 inspections: 3 today, the rest over the previous 1-4 days (incl. route history below).
 * Includes one STOP_OPERASI today (DT-014, rem utama), one
 * OPERASI_DENGAN_PERHATIAN today (EX-207, kaca kabin), rest LAYAK_OPERASI.
 */
export const SEED_INSPECTIONS: readonly SeedInspectionTemplate[] = [
  {
    id: 'd2f1a000-0001-4a00-8a00-000000000001',
    unitId: DT_014,
    namaOperator: 'Slamet Riyadi',
    nrp: '21.04.0132',
    shift: 'PAGI',
    hoursAgo: 2,
    lokasiKerja: 'Pit Utara — Front Loading 3',
    hmKmAwal: 12450.5,
    hmKmAkhir: 12480.0,
    catatanOperator: 'Rem terasa tidak pakem sejak awal shift, unit dihentikan untuk pemeriksaan mekanik.',
    latitude: -0.6231,
    longitude: 117.1123,
    overrides: [
      {
        key: 'rem_utama',
        hasil: 'TIDAK_NORMAL',
        keterangan: 'Pedal rem terasa dalam, jarak pengereman panjang',
      },
      { key: 'kotak_p3k', hasil: 'NA', keterangan: 'Kotak P3K baru diganti, belum diisi ulang' },
    ],
  },
  {
    id: 'd2f1a000-0001-4a00-8a00-000000000002',
    unitId: EX_207,
    namaOperator: 'Budi Santoso',
    nrp: '21.05.0087',
    shift: 'PAGI',
    hoursAgo: 4,
    lokasiKerja: 'Pit Utara — Front Loading 3',
    hmKmAwal: 8320.0,
    hmKmAkhir: 8350.5,
    catatanOperator: 'Kaca kabin retak ringan akibat kerikil, sudah dilaporkan ke workshop.',
    latitude: -0.5872,
    longitude: 117.0498,
    overrides: [
      {
        key: 'kaca_kabin_wiper_spion',
        hasil: 'TIDAK_NORMAL',
        keterangan: 'Kaca depan retak kecil, visibility masih memadai',
      },
    ],
  },
  {
    id: 'd2f1a000-0001-4a00-8a00-000000000003',
    unitId: LV_032,
    namaOperator: 'Agus Salim',
    nrp: '21.03.0210',
    shift: 'SIANG',
    hoursAgo: 6,
    lokasiKerja: 'Pit Utara — Pos Dispatch',
    hmKmAwal: 5410.2,
    hmKmAkhir: 5460.0,
    catatanOperator: 'Unit dalam kondisi baik, siap operasi.',
    latitude: -0.7104,
    longitude: 117.2231,
    overrides: [
      { key: 'ban_serep', hasil: 'NA', keterangan: 'Ban serep sedang diservis di bengkel' },
    ],
  },
  {
    id: 'd2f1a000-0001-4a00-8a00-000000000004',
    unitId: DT_021,
    namaOperator: 'Hendra Wijaya',
    nrp: '21.04.0301',
    shift: 'MALAM',
    hoursAgo: 28,
    lokasiKerja: 'Pit Selatan — Front Loading 1',
    hmKmAwal: 15200.0,
    hmKmAkhir: 15240.5,
    catatanOperator: 'Tidak ada temuan, unit siap operasi.',
    latitude: -0.9310,
    longitude: 117.0920,
    overrides: [],
  },
  {
    id: 'd2f1a000-0001-4a00-8a00-000000000005',
    unitId: EX_212,
    namaOperator: 'Dedi Kurniawan',
    nrp: '21.02.0055',
    shift: 'PAGI',
    hoursAgo: 52,
    lokasiKerja: 'Pit Selatan — Front Loading 2',
    hmKmAwal: 9800.5,
    hmKmAkhir: 9840.0,
    catatanOperator: 'Unit beroperasi normal.',
    latitude: -1.0521,
    longitude: 116.9012,
    overrides: [
      { key: 'panel_indikator_lampu_peringatan', hasil: 'NA', keterangan: 'Panel sedang dikalibrasi teknisi' },
    ],
  },
  {
    id: 'd2f1a000-0001-4a00-8a00-000000000006',
    unitId: GS_005,
    namaOperator: 'Siti Aminah',
    nrp: '21.01.0044',
    shift: 'SIANG',
    hoursAgo: 100,
    lokasiKerja: 'Workshop — Area Genset',
    hmKmAwal: 3200.0,
    hmKmAkhir: 3212.5,
    catatanOperator: 'Genset beroperasi stabil, tidak ada gangguan.',
    latitude: -0.5205,
    longitude: 117.1180,
    overrides: [],
  },
  ...routeHistory(),
];

/**
 * Earlier, all-NORMAL inspections of the same units a short distance apart, so the
 * dashboard map shows a route per unit on first open. All older than today, so the
 * "hari ini" tiles are unaffected.
 */
function routeHistory(): SeedInspectionTemplate[] {
  const base = {
    shift: 'PAGI' as const,
    catatanOperator: 'Tidak ada temuan, unit siap operasi.',
    overrides: [],
  };
  return [
    { ...base, id: 'd2f1a000-0001-4a00-8a00-000000000007', unitId: DT_014, namaOperator: 'Slamet Riyadi', nrp: '21.04.0132', hoursAgo: 50, lokasiKerja: 'Pit Utara — Disposal 1', hmKmAwal: 12410.0, hmKmAkhir: 12428.0, latitude: -0.6720, longitude: 117.0480 },
    { ...base, id: 'd2f1a000-0001-4a00-8a00-000000000008', unitId: DT_014, namaOperator: 'Rahmat Hidayat', nrp: '21.04.0145', hoursAgo: 26, lokasiKerja: 'Pit Utara — Hauling Road KM 2', hmKmAwal: 12428.0, hmKmAkhir: 12450.5, latitude: -0.6470, longitude: 117.0850 },
    { ...base, id: 'd2f1a000-0001-4a00-8a00-000000000009', unitId: EX_207, namaOperator: 'Budi Santoso', nrp: '21.05.0087', hoursAgo: 30, lokasiKerja: 'Pit Utara — Front Loading 2', hmKmAwal: 8295.0, hmKmAkhir: 8320.0, latitude: -0.6230, longitude: 116.9980 },
    { ...base, id: 'd2f1a000-0001-4a00-8a00-000000000010', unitId: DT_021, namaOperator: 'Hendra Wijaya', nrp: '21.04.0301', hoursAgo: 76, lokasiKerja: 'Pit Selatan — Disposal 3', hmKmAwal: 15160.0, hmKmAkhir: 15200.0, latitude: -0.9820, longitude: 117.0350 },
    { ...base, id: 'd2f1a000-0001-4a00-8a00-000000000011', unitId: LV_032, namaOperator: 'Agus Salim', nrp: '21.03.0210', hoursAgo: 48, lokasiKerja: 'Workshop — Parkir LV', hmKmAwal: 5302.0, hmKmAkhir: 5355.0, latitude: -0.7850, longitude: 117.1450 },
    { ...base, id: 'd2f1a000-0001-4a00-8a00-000000000012', unitId: LV_032, namaOperator: 'Agus Salim', nrp: '21.03.0210', hoursAgo: 24, lokasiKerja: 'Pit Utara — Hauling Road KM 5', hmKmAwal: 5355.0, hmKmAkhir: 5410.2, latitude: -0.7480, longitude: 117.1880 },
  ];
}

/** 3 safety talks: one today, two spread over the previous days. */
export const SEED_SAFETY_TALKS: readonly SeedSafetyTalkTemplate[] = [
  {
    id: 'd2f1a000-0002-4a00-8a00-000000000001',
    topik: 'Bahaya Blind Spot Alat Berat',
    namaPemimpin: 'Rudi Hartono',
    nrpPemimpin: '21.01.0010',
    jamMulai: '06:45',
    shift: 'PAGI',
    lokasiArea: 'Pit Utara — Pos Dispatch',
    departemenRegu: 'Produksi — Regu B',
    hoursAgo: 3,
    uraianSingkat: 'Pengingat area blind spot alat berat sebelum mulai shift pagi.',
    potensiBahaya: [
      'Operator alat berat tidak melihat pekerja di area blind spot',
      'Pekerja berjalan terlalu dekat dengan unit yang sedang manuver',
    ],
    komitmenPengendalian: [
      'Selalu menggunakan radio komunikasi sebelum unit bergerak mundur',
      'Menjaga jarak aman minimal 10 meter dari alat berat yang beroperasi',
    ],
    informasiPengumuman: 'Akan ada pengecekan rutin APD oleh tim HSE pekan ini.',
    peserta: [
      { nama: 'Slamet Riyadi', nrp: '21.04.0132', hadir: true },
      { nama: 'Budi Santoso', nrp: '21.05.0087', hadir: true },
      { nama: 'Wawan Setiawan', nrp: '21.03.0198', hadir: true },
      { nama: 'Yusuf Maulana', nrp: '21.02.0076', hadir: true },
      { nama: 'Andi Prasetyo', nrp: '21.06.0043', hadir: true },
      { nama: 'Fajar Nugroho', nrp: '21.04.0288', hadir: true },
      { nama: 'Bambang Irawan', nrp: '21.03.0155', hadir: false },
      { nama: 'Teguh Santosa', nrp: '21.05.0119', hadir: false },
    ],
    catatan: 'Seluruh peserta yang hadir memahami materi yang disampaikan.',
    latitude: -0.6187,
    longitude: 117.1042,
  },
  {
    id: 'd2f1a000-0002-4a00-8a00-000000000002',
    topik: 'Fatigue Management',
    namaPemimpin: 'Siti Aminah',
    nrpPemimpin: '21.01.0044',
    jamMulai: '18:30',
    shift: 'MALAM',
    lokasiArea: 'Pit Selatan — Workshop',
    departemenRegu: 'Maintenance — Regu A',
    hoursAgo: 30,
    uraianSingkat: 'Edukasi tanda-tanda kelelahan kerja sebelum memulai shift malam.',
    potensiBahaya: [
      'Operator mengantuk saat mengoperasikan unit',
      'Konsentrasi menurun akibat kurang istirahat',
    ],
    komitmenPengendalian: [
      'Melapor ke pengawas bila merasa mengantuk saat bekerja',
      'Istirahat cukup minimal 6 jam sebelum shift malam',
    ],
    informasiPengumuman: '',
    peserta: [
      { nama: 'Hendra Wijaya', nrp: '21.04.0301', hadir: true },
      { nama: 'Agus Salim', nrp: '21.03.0210', hadir: true },
      { nama: 'Bambang Irawan', nrp: '21.03.0155', hadir: true },
      { nama: 'Teguh Santosa', nrp: '21.05.0119', hadir: true },
      { nama: 'Rian Hidayat', nrp: '21.02.0091', hadir: true },
      { nama: 'Joko Susilo', nrp: '21.02.0077', hadir: true },
      { nama: 'Dedi Kurniawan', nrp: '21.01.0044', hadir: false },
    ],
    catatan: 'Operator diminta istirahat cukup sebelum menjalani shift malam berikutnya.',
    latitude: -0.9420,
    longitude: 117.0610,
  },
  {
    id: 'd2f1a000-0002-4a00-8a00-000000000003',
    topik: 'Penggunaan APD Lengkap',
    namaPemimpin: 'Joko Susilo',
    nrpPemimpin: '21.02.0077',
    jamMulai: '06:30',
    shift: 'PAGI',
    lokasiArea: 'Pit Utara — Pos Dispatch',
    departemenRegu: 'Produksi — Regu C',
    hoursAgo: 75,
    uraianSingkat: 'Reminder pemakaian APD lengkap di seluruh area pit.',
    potensiBahaya: [
      'Pekerja tidak memakai kacamata safety saat bekerja di area debu',
      'Sarung tangan yang digunakan tidak sesuai standar',
    ],
    komitmenPengendalian: [
      'Pengecekan kelengkapan APD sebelum masuk area kerja',
      'Teguran tertulis bagi yang tidak memakai APD lengkap',
    ],
    informasiPengumuman: 'Distribusi APD baru akan dilakukan minggu depan.',
    peserta: [
      { nama: 'Dedi Kurniawan', nrp: '21.01.0044', hadir: true },
      { nama: 'Slamet Riyadi', nrp: '21.04.0132', hadir: true },
      { nama: 'Budi Santoso', nrp: '21.05.0087', hadir: true },
      { nama: 'Agus Salim', nrp: '21.03.0210', hadir: true },
      { nama: 'Hendra Wijaya', nrp: '21.04.0301', hadir: true },
      { nama: 'Wawan Setiawan', nrp: '21.03.0198', hadir: false },
    ],
    catatan: 'Ditemukan beberapa pekerja tidak memakai kacamata safety, sudah ditegur di lokasi.',
    latitude: -0.6305,
    longitude: 117.0987,
  },
];

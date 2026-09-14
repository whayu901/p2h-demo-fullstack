/** Equipment/unit categories tracked by P2H. */
export const UNIT_TYPES = ['DUMP_TRUCK', 'EXCAVATOR', 'LIGHT_VEHICLE', 'GENSET'] as const;
export type UnitType = (typeof UNIT_TYPES)[number];

/** Work shifts. */
export const SHIFTS = ['PAGI', 'SIANG', 'MALAM'] as const;
export type Shift = (typeof SHIFTS)[number];

/** Whether a locally-created record has reached the server yet (device-only concept). */
export const SYNC_STATUSES = ['PENDING', 'SYNCED'] as const;
export type SyncStatus = (typeof SYNC_STATUSES)[number];

/** Indonesian display labels for unit types. */
export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  DUMP_TRUCK: 'Dump Truck',
  EXCAVATOR: 'Excavator',
  LIGHT_VEHICLE: 'Light Vehicle',
  GENSET: 'Genset',
};

/** Indonesian display labels for shifts. */
export const SHIFT_LABELS: Record<Shift, string> = {
  PAGI: 'Pagi',
  SIANG: 'Siang',
  MALAM: 'Malam',
};

/** Result of a single P2H checklist item. */
export const HASIL_ITEM = ['NORMAL', 'TIDAK_NORMAL', 'NA'] as const;
export type HasilItemValue = (typeof HASIL_ITEM)[number];

/** Indonesian display labels for checklist item results. */
export const HASIL_ITEM_LABELS: Record<HasilItemValue, string> = {
  NORMAL: 'Normal',
  TIDAK_NORMAL: 'Tidak Normal',
  NA: 'N/A',
};

/**
 * Hazard classification of a checklist item, from most to least severe.
 * AA/A items being TIDAK_NORMAL force a STOP_OPERASI verdict.
 */
export const KODE_BAHAYA = ['AA', 'A', 'B', 'C'] as const;
export type KodeBahaya = (typeof KODE_BAHAYA)[number];

/** Indonesian display labels for hazard codes. */
export const KODE_BAHAYA_LABELS: Record<KodeBahaya, string> = {
  AA: 'Sangat Bahaya',
  A: 'Bahaya Tinggi',
  B: 'Bahaya Sedang',
  C: 'Bahaya Rendah',
};

/** Sections of the P2H checklist form, in display order. */
export const P2H_SECTIONS = ['KELILING_UNIT', 'DALAM_KABIN', 'TEST_FUNGSI'] as const;
export type P2HSection = (typeof P2H_SECTIONS)[number];

/** Indonesian display labels for P2H checklist sections. */
export const P2H_SECTION_LABELS: Record<P2HSection, string> = {
  KELILING_UNIT: 'A. Pemeriksaan Keliling Unit — mesin mati',
  DALAM_KABIN: 'B. Pemeriksaan Dalam Kabin',
  TEST_FUNGSI: 'C. Test Fungsi — mesin hidup',
};

/** Final verdict on whether a unit may keep operating after a P2H inspection. */
export const STATUS_KELAYAKAN = [
  'LAYAK_OPERASI',
  'OPERASI_DENGAN_PERHATIAN',
  'STOP_OPERASI',
] as const;
export type StatusKelayakan = (typeof STATUS_KELAYAKAN)[number];

/** Indonesian display labels for the operational verdict. */
export const STATUS_KELAYAKAN_LABELS: Record<StatusKelayakan, string> = {
  LAYAK_OPERASI: 'LAYAK OPERASI',
  OPERASI_DENGAN_PERHATIAN: 'OPERASI DENGAN PERHATIAN',
  STOP_OPERASI: 'STOP OPERASI',
};

import type { HasilItemValue, KodeBahaya, P2HSection, UnitType } from './enums';
import { P2H_SECTIONS, P2H_SECTION_LABELS } from './enums';

/** One P2H checklist item as defined by the form template (no result attached yet). */
export interface ItemP2H {
  key: string;
  label: string;
  section: P2HSection;
  kodeBahaya: KodeBahaya;
}

/** A single answered checklist item, without the item definition it belongs to. */
export interface HasilItem {
  key: string;
  hasil: HasilItemValue;
  keterangan?: string;
}

/**
 * What a submitted inspection actually stores: a snapshot of the item
 * definition plus its result. Keeping the snapshot makes old inspections
 * audit-safe even if the checklist template changes later.
 */
export interface HasilItemP2H extends ItemP2H {
  hasil: HasilItemValue;
  keterangan?: string;
}

/** The P2H checklist template per unit type, grouped implicitly by section order. */
export const CHECKLISTS: Record<UnitType, readonly ItemP2H[]> = {
  DUMP_TRUCK: [
    // A. Keliling Unit — mesin mati
    { key: 'level_oli_engine', label: 'Level oli engine', section: 'KELILING_UNIT', kodeBahaya: 'A' },
    { key: 'level_air_radiator', label: 'Level air radiator', section: 'KELILING_UNIT', kodeBahaya: 'A' },
    { key: 'level_oli_hidrolik', label: 'Level oli hidrolik', section: 'KELILING_UNIT', kodeBahaya: 'A' },
    {
      key: 'kebocoran_oli_bbm_air',
      label: 'Kebocoran oli, bahan bakar, dan air',
      section: 'KELILING_UNIT',
      kodeBahaya: 'AA',
    },
    {
      key: 'kondisi_ban_pelek_baut_roda',
      label: 'Kondisi ban, pelek, dan baut roda',
      section: 'KELILING_UNIT',
      kodeBahaya: 'AA',
    },
    {
      key: 'kondisi_kabin_luar',
      label: 'Kondisi kabin: kaca depan, spion, wiper, tangga',
      section: 'KELILING_UNIT',
      kodeBahaya: 'B',
    },
    {
      key: 'lampu_kerja_depan_belakang',
      label: 'Lampu kerja depan dan belakang',
      section: 'KELILING_UNIT',
      kodeBahaya: 'A',
    },
    {
      key: 'kebersihan_unit',
      label: 'Kebersihan unit dan kondisi tidak normal',
      section: 'KELILING_UNIT',
      kodeBahaya: 'C',
    },
    {
      key: 'apar_tekanan_masa_berlaku',
      label: 'APAR: tekanan dan masa berlaku',
      section: 'KELILING_UNIT',
      kodeBahaya: 'AA',
    },
    { key: 'kotak_p3k', label: 'Kotak P3K', section: 'KELILING_UNIT', kodeBahaya: 'C' },
    // B. Dalam Kabin
    { key: 'sabuk_pengaman', label: 'Sabuk pengaman', section: 'DALAM_KABIN', kodeBahaya: 'AA' },
    { key: 'klakson', label: 'Klakson', section: 'DALAM_KABIN', kodeBahaya: 'A' },
    { key: 'alarm_mundur', label: 'Alarm mundur', section: 'DALAM_KABIN', kodeBahaya: 'AA' },
    {
      key: 'panel_indikator_lampu_peringatan',
      label: 'Panel indikator dan lampu peringatan',
      section: 'DALAM_KABIN',
      kodeBahaya: 'A',
    },
    { key: 'radio_komunikasi', label: 'Radio komunikasi', section: 'DALAM_KABIN', kodeBahaya: 'A' },
    { key: 'rem_parkir', label: 'Rem parkir', section: 'DALAM_KABIN', kodeBahaya: 'AA' },
    // C. Test Fungsi — mesin hidup
    { key: 'rem_utama', label: 'Rem utama (service brake)', section: 'TEST_FUNGSI', kodeBahaya: 'AA' },
    { key: 'sistem_steering', label: 'Sistem steering', section: 'TEST_FUNGSI', kodeBahaya: 'AA' },
    {
      key: 'hidrolik_fungsi_dump',
      label: 'Hidrolik dan fungsi dump',
      section: 'TEST_FUNGSI',
      kodeBahaya: 'A',
    },
    {
      key: 'lampu_rotary_strobe',
      label: 'Lampu rotary / strobe',
      section: 'TEST_FUNGSI',
      kodeBahaya: 'A',
    },
    { key: 'tekanan_udara', label: 'Tekanan udara', section: 'TEST_FUNGSI', kodeBahaya: 'A' },
  ],
  EXCAVATOR: [
    // A. Keliling Unit — mesin mati
    { key: 'level_oli_engine', label: 'Level oli engine', section: 'KELILING_UNIT', kodeBahaya: 'A' },
    { key: 'level_air_radiator', label: 'Level air radiator', section: 'KELILING_UNIT', kodeBahaya: 'A' },
    { key: 'level_oli_hidrolik', label: 'Level oli hidrolik', section: 'KELILING_UNIT', kodeBahaya: 'A' },
    {
      key: 'kondisi_undercarriage_track',
      label: 'Kondisi undercarriage, track shoe, dan tension track',
      section: 'KELILING_UNIT',
      kodeBahaya: 'AA',
    },
    {
      key: 'kondisi_bucket_pin_attachment',
      label: 'Kondisi bucket, cutting edge, dan pin attachment',
      section: 'KELILING_UNIT',
      kodeBahaya: 'AA',
    },
    {
      key: 'kebocoran_oli_bbm_air',
      label: 'Kebocoran oli, bahan bakar, dan air',
      section: 'KELILING_UNIT',
      kodeBahaya: 'AA',
    },
    // B. Dalam Kabin
    { key: 'sabuk_pengaman', label: 'Sabuk pengaman', section: 'DALAM_KABIN', kodeBahaya: 'AA' },
    {
      key: 'kaca_kabin_wiper_spion',
      label: 'Kaca kabin, wiper, dan spion',
      section: 'DALAM_KABIN',
      kodeBahaya: 'B',
    },
    { key: 'klakson_alarm', label: 'Klakson dan alarm', section: 'DALAM_KABIN', kodeBahaya: 'A' },
    {
      key: 'panel_indikator_lampu_peringatan',
      label: 'Panel indikator dan lampu peringatan',
      section: 'DALAM_KABIN',
      kodeBahaya: 'A',
    },
    // C. Test Fungsi — mesin hidup
    {
      key: 'hidrolik_boom_arm_bucket',
      label: 'Sistem hidrolik: boom, arm, bucket',
      section: 'TEST_FUNGSI',
      kodeBahaya: 'A',
    },
    {
      key: 'swing_brake_motor',
      label: 'Swing brake dan swing motor',
      section: 'TEST_FUNGSI',
      kodeBahaya: 'AA',
    },
    { key: 'rem_parkir_travel', label: 'Rem parkir (travel)', section: 'TEST_FUNGSI', kodeBahaya: 'AA' },
    {
      key: 'lampu_kerja_rotary',
      label: 'Lampu kerja dan lampu rotary',
      section: 'TEST_FUNGSI',
      kodeBahaya: 'A',
    },
  ],
  LIGHT_VEHICLE: [
    // A. Keliling Unit — mesin mati
    {
      key: 'kondisi_ban',
      label: 'Kondisi ban (tapak dan tekanan angin)',
      section: 'KELILING_UNIT',
      kodeBahaya: 'A',
    },
    { key: 'ban_serep', label: 'Ban serep', section: 'KELILING_UNIT', kodeBahaya: 'A' },
    { key: 'dongkrak_kunci_roda', label: 'Dongkrak dan kunci roda', section: 'KELILING_UNIT', kodeBahaya: 'B' },
    {
      key: 'kondisi_body_kaca_spion',
      label: 'Kondisi body, kaca, dan spion',
      section: 'KELILING_UNIT',
      kodeBahaya: 'C',
    },
    {
      key: 'lampu_utama_sein_rem',
      label: 'Lampu utama, sein, dan rem',
      section: 'KELILING_UNIT',
      kodeBahaya: 'A',
    },
    {
      key: 'lampu_rotary_bendera',
      label: 'Lampu rotary dan bendera/buggy whip',
      section: 'KELILING_UNIT',
      kodeBahaya: 'A',
    },
    {
      key: 'kebocoran_oli_air_radiator',
      label: 'Kebocoran oli dan air radiator',
      section: 'KELILING_UNIT',
      kodeBahaya: 'B',
    },
    // B. Dalam Kabin
    { key: 'sabuk_pengaman', label: 'Sabuk pengaman', section: 'DALAM_KABIN', kodeBahaya: 'AA' },
    { key: 'klakson', label: 'Klakson', section: 'DALAM_KABIN', kodeBahaya: 'A' },
    { key: 'rem_parkir', label: 'Rem parkir', section: 'DALAM_KABIN', kodeBahaya: 'AA' },
    {
      key: 'panel_indikator_lampu_peringatan',
      label: 'Panel indikator dan lampu peringatan',
      section: 'DALAM_KABIN',
      kodeBahaya: 'A',
    },
    // C. Test Fungsi — mesin hidup
    { key: 'rem_utama', label: 'Rem utama', section: 'TEST_FUNGSI', kodeBahaya: 'AA' },
    { key: 'sistem_kemudi', label: 'Sistem kemudi', section: 'TEST_FUNGSI', kodeBahaya: 'AA' },
    { key: 'wiper_washer_kaca', label: 'Wiper dan washer kaca', section: 'TEST_FUNGSI', kodeBahaya: 'C' },
  ],
  GENSET: [
    // A. Keliling Unit — mesin mati
    { key: 'level_bahan_bakar', label: 'Level bahan bakar', section: 'KELILING_UNIT', kodeBahaya: 'A' },
    { key: 'level_oli_engine', label: 'Level oli engine', section: 'KELILING_UNIT', kodeBahaya: 'A' },
    { key: 'level_air_radiator', label: 'Level air radiator', section: 'KELILING_UNIT', kodeBahaya: 'A' },
    {
      key: 'kebocoran_oli_bbm_air',
      label: 'Kebocoran oli, bahan bakar, dan air',
      section: 'KELILING_UNIT',
      kodeBahaya: 'AA',
    },
    { key: 'kondisi_grounding', label: 'Kondisi grounding', section: 'KELILING_UNIT', kodeBahaya: 'AA' },
    {
      key: 'kebersihan_unit_area',
      label: 'Kebersihan unit dan area sekitar',
      section: 'KELILING_UNIT',
      kodeBahaya: 'C',
    },
    // B. Dalam Kabin (ruang/panel kontrol)
    {
      key: 'panel_kontrol_indikator',
      label: 'Panel kontrol dan indikator tegangan/frekuensi',
      section: 'DALAM_KABIN',
      kodeBahaya: 'A',
    },
    {
      key: 'kabel_sambungan_panel',
      label: 'Kabel dan sambungan panel',
      section: 'DALAM_KABIN',
      kodeBahaya: 'AA',
    },
    {
      key: 'sistem_proteksi_breaker',
      label: 'Sistem proteksi (circuit breaker/relay)',
      section: 'DALAM_KABIN',
      kodeBahaya: 'AA',
    },
    {
      key: 'pencahayaan_ruang_panel',
      label: 'Pencahayaan ruang panel',
      section: 'DALAM_KABIN',
      kodeBahaya: 'C',
    },
    // C. Test Fungsi — mesin hidup
    {
      key: 'start_engine_tekanan_oli',
      label: 'Start engine dan tekanan oli saat running',
      section: 'TEST_FUNGSI',
      kodeBahaya: 'A',
    },
    {
      key: 'beban_output_tegangan_frekuensi',
      label: 'Beban dan output tegangan/frekuensi',
      section: 'TEST_FUNGSI',
      kodeBahaya: 'A',
    },
    {
      key: 'alarm_indikator_gangguan',
      label: 'Alarm dan indikator gangguan',
      section: 'TEST_FUNGSI',
      kodeBahaya: 'A',
    },
    { key: 'apar_kotak_p3k', label: 'APAR dan kotak P3K', section: 'TEST_FUNGSI', kodeBahaya: 'AA' },
  ],
};

/** Looks up the flat checklist template for a given unit type. */
export function getChecklist(type: UnitType): readonly ItemP2H[] {
  return CHECKLISTS[type];
}

/** Groups a unit type's checklist template by section, in P2H_SECTIONS order. */
export function getChecklistBySection(
  type: UnitType,
): { section: P2HSection; label: string; items: readonly ItemP2H[] }[] {
  const items = getChecklist(type);
  return P2H_SECTIONS.map((section) => ({
    section,
    label: P2H_SECTION_LABELS[section],
    items: items.filter((item) => item.section === section),
  }));
}

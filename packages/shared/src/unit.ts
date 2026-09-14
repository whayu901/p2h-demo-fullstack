import type { StatusKelayakan, UnitType } from './enums';

/** A physical piece of equipment that can be inspected. */
export interface Unit {
  id: string;
  code: string;
  name: string;
  type: UnitType;
  site: string;
}

/** A unit enriched with a summary of its most recent P2H inspection, for list views. */
export interface UnitDenganStatus extends Unit {
  inspeksiTerakhir: {
    tanggal: string;
    statusKelayakan: StatusKelayakan;
    namaOperator: string;
  } | null;
}

/**
 * Fixed seed data shared by the mobile app and the API so both sides agree on
 * unit ids without a network round trip. Ids are hardcoded UUIDs, not generated,
 * so re-seeding never produces mismatched records.
 */
export const SEED_UNITS: readonly Unit[] = [
  {
    id: '9c1f0b0a-0001-4a4e-8c1a-000000000001',
    code: 'DT-014',
    name: 'Komatsu HD785-7',
    type: 'DUMP_TRUCK',
    site: 'Pit Utara',
  },
  {
    id: '9c1f0b0a-0001-4a4e-8c1a-000000000002',
    code: 'DT-021',
    name: 'Caterpillar 777E',
    type: 'DUMP_TRUCK',
    site: 'Pit Selatan',
  },
  {
    id: '9c1f0b0a-0002-4a4e-8c1a-000000000003',
    code: 'EX-207',
    name: 'Hitachi EX1200-6',
    type: 'EXCAVATOR',
    site: 'Pit Utara',
  },
  {
    id: '9c1f0b0a-0002-4a4e-8c1a-000000000004',
    code: 'EX-212',
    name: 'Komatsu PC2000-8',
    type: 'EXCAVATOR',
    site: 'Pit Selatan',
  },
  {
    id: '9c1f0b0a-0003-4a4e-8c1a-000000000005',
    code: 'LV-032',
    name: 'Toyota Hilux 4x4',
    type: 'LIGHT_VEHICLE',
    site: 'Pit Utara',
  },
  {
    id: '9c1f0b0a-0003-4a4e-8c1a-000000000006',
    code: 'LV-045',
    name: 'Mitsubishi Triton 4x4',
    type: 'LIGHT_VEHICLE',
    site: 'Pit Selatan',
  },
  {
    id: '9c1f0b0a-0004-4a4e-8c1a-000000000007',
    code: 'GS-005',
    name: 'Caterpillar C18 500 kVA',
    type: 'GENSET',
    site: 'Workshop',
  },
  {
    id: '9c1f0b0a-0004-4a4e-8c1a-000000000008',
    code: 'GS-009',
    name: 'Cummins C550D5',
    type: 'GENSET',
    site: 'Workshop',
  },
];

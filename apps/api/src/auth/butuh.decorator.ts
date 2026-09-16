import { SetMetadata } from '@nestjs/common';
import type { Aksi } from '@p2h/shared';

export const BUTUH_AKSI_KEY = 'butuhAksi';

/** Marks a controller method as requiring the given RBAC action, checked by PeranGuard. */
export const Butuh = (aksi: Aksi): ReturnType<typeof SetMetadata> => SetMetadata(BUTUH_AKSI_KEY, aksi);

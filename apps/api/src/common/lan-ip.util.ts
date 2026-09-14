import { networkInterfaces } from 'node:os';

/** Returns every non-internal IPv4 address of this machine, for LAN access hints. */
export function listLanIPv4Addresses(): string[] {
  const interfaces = networkInterfaces();
  const addresses: string[] = [];
  for (const entries of Object.values(interfaces)) {
    if (!entries) continue;
    for (const entry of entries) {
      if (entry.family === 'IPv4' && !entry.internal) {
        addresses.push(entry.address);
      }
    }
  }
  return addresses;
}

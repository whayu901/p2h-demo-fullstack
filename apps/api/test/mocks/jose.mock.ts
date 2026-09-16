/**
 * Test-only stand-in for `jose` (wired up via jest.config.js
 * moduleNameMapper). `jose` v6 is pure ESM; Node's `require()` loads it fine
 * at runtime (Node 20.19+), but Jest's own module loader can't without Node
 * 24.9+. No test in this suite exercises a real signed token, so a minimal
 * throwing stub is enough — production always uses the real package.
 */

export function createRemoteJWKSet(..._args: unknown[]): unknown {
  return (): void => undefined;
}

export async function jwtVerify(..._args: unknown[]): Promise<{ payload: Record<string, unknown> }> {
  throw new Error('jose.mock: jwtVerify tidak diimplementasikan di test — tidak ada test yang seharusnya memanggil ini.');
}

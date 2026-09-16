/**
 * Test-only stand-in for @nestjs/schedule (wired up via jest.config.js
 * moduleNameMapper). The real package is pure ESM and Node's `require()` can
 * load it fine at runtime (Node 20.19+), but Jest's own module loader can't
 * without Node 24.9+ — so tests use this minimal CJS shim instead. Production
 * code (main.ts/app.module.ts under `nest start`/`nest build`) always uses
 * the real package; this file is never imported outside Jest.
 */

export function Cron(..._args: unknown[]): MethodDecorator {
  return () => undefined;
}

export const CronExpression = {
  EVERY_DAY_AT_3AM: '0 0 3 * * *',
} as const;

export class ScheduleModule {
  static forRoot(): { module: typeof ScheduleModule } {
    return { module: ScheduleModule };
  }
}

export class SchedulerRegistry {}

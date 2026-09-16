/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  // @nestjs/schedule and jose are pure ESM; Jest's loader can't require()
  // them (Node can, at runtime — see test/mocks/*.mock.ts for why this is safe).
  moduleNameMapper: {
    '^@nestjs/schedule$': '<rootDir>/test/mocks/nestjs-schedule.mock.ts',
    '^jose$': '<rootDir>/test/mocks/jose.mock.ts',
  },
  // Tests run one at a time: each spec boots its own sqlite (file or :memory:)
  // Nest app, and running them in parallel workers isn't needed for a suite this small.
  maxWorkers: 1,
  // Some local/CI machines have a broken or absent `watchman` binary; Jest's
  // default crawler falls back gracefully when it errors, but a hard crash
  // (e.g. a broken dylib) can abort the run before any test executes. This
  // suite is small enough that watchman's speed-up isn't needed.
  watchman: false,
};

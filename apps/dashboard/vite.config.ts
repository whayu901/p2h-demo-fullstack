import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // The shared package is built as CommonJS in packages/shared/dist, which
      // Vite does not pre-bundle for linked workspace packages during dev. To
      // avoid broken named imports at runtime, consume the TS source directly;
      // TypeScript still type-checks against the published package normally.
      '@p2h/shared': fileURLToPath(
        new URL('../../packages/shared/src/index.ts', import.meta.url),
      ),
    },
  },
})

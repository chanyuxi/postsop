import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

import {
  base,
  jsonc,
  react,
  reactNative,
  testing,
} from '@postsop/configs/eslint'

/**
 * Monorepo level configuration
 */
export default defineConfig(
  globalIgnores([
    '**/.turbo/**',
    '**/dist/**',
    'apps/client-app/android/**',
    'apps/client-app/ios/**',
    '**/uniwind-types.d.ts',
    'apps/server/src/generated/prisma/**',
  ]),

  base,
  jsonc,
  testing,

  {
    files: ['apps/client-app/**/*.{js,jsx,ts,tsx}'],
    extends: [react, reactNative],
  },

  {
    files: ['apps/server/**/*.{js,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  }
)

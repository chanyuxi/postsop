import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

import { base, jsonc, react, reactNative, testing } from './config/eslint'

const clientApp = ['apps/client-app/**/*.{js,jsx,ts,tsx}']
const server = ['apps/server/**/*.{js,ts}']

export default defineConfig(
  globalIgnores([
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
    files: clientApp,
    extends: [react, reactNative],
  },

  {
    files: server,
    languageOptions: {
      globals: globals.node,
    },
  }
)

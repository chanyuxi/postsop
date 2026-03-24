import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

import { base, jsonc, react, reactNative, testing } from './config/eslint'

const mobile = ['apps/mobile/**/*.{js,jsx,ts,tsx}']
const server = ['apps/server/**/*.{js,ts}']

export default defineConfig(
  globalIgnores([
    '**/dist/**',
    'apps/mobile/android/**',
    'apps/mobile/ios/**',
    '**/uniwind-types.d.ts',
    'apps/server/src/generated/prisma/**',
  ]),

  base,
  jsonc,
  testing,

  {
    files: mobile,
    extends: react,
  },
  {
    files: mobile,
    extends: reactNative,
  },

  {
    files: server,
    languageOptions: {
      globals: globals.node,
    },
  }
)

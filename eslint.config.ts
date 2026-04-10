import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

import {
  base,
  jsonc,
  react,
  reactNative,
  testing,
} from '@postsop/configs/eslint'

const clientApp = ['apps/client-app/**/*.{js,jsx,ts,tsx}']
const clientAppIgnores = [
  'apps/client-app/android/**',
  'apps/client-app/ios/**',
  '**/uniwind-types.d.ts',
]

const server = ['apps/server/**/*.{js,ts}']
const serverIgnores = ['apps/server/src/generated/prisma/**']

export default defineConfig(
  globalIgnores([
    '**/dist/**',
    '**/.turbo/**',
    ...clientAppIgnores,
    ...serverIgnores,
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

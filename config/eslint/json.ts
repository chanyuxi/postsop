import { defineConfig } from 'eslint/config'
import eslintPluginJsonc from 'eslint-plugin-jsonc'

import {
  gitHookOrder,
  packageJsonExportsOrder,
  packageJsonTopLevelOrder,
  tsconfigCompilerOptionsOrder,
  tsconfigTopLevelOrder,
} from './json-sort-orders'

export default defineConfig(
  ...eslintPluginJsonc.configs['recommended-with-jsonc'],

  {
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-array-values': [
        'error',
        {
          order: { type: 'asc' },
          pathPattern: '^files$',
        },
      ],
      'jsonc/sort-keys': [
        'error',
        {
          order: packageJsonTopLevelOrder,
          pathPattern: '^$',
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$',
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(?:resolutions|overrides|pnpm.overrides)$',
        },
        {
          order: packageJsonExportsOrder,
          pathPattern: '^exports.*$',
        },
        {
          order: gitHookOrder,
          pathPattern: '^(?:gitHooks|husky|simple-git-hooks)$',
        },
      ],
    },
  },

  {
    files: ['**/tsconfig.json', '**/tsconfig.*.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          order: tsconfigTopLevelOrder,
          pathPattern: '^$',
        },
        {
          order: tsconfigCompilerOptionsOrder,
          pathPattern: '^compilerOptions$',
        },
      ],
    },
  }
)

import eslint from '@eslint/js'
import type { Linter } from 'eslint'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { createStyleConfig } from './common.ts'
import { createJsonConfig } from './configs/json.ts'

const typedFiles = ['**/*.{ts,tsx,mts,cts}']

interface BackendConfigOptions {
  tsconfigRootDir: string
  ignores?: string[]
  extraConfig?: Linter.Config[]
}

export function createBackendConfig({
  tsconfigRootDir,
  ignores = [],
  extraConfig = [],
}: BackendConfigOptions): Linter.Config[] {
  return tseslint.config(
    {
      ignores: [
        'eslint.config.mts',
        'dist',
        'src/generated/prisma/*',
        ...ignores,
      ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked.map((config) => ({
      ...config,
      files: typedFiles,
    })),
    ...createStyleConfig({
      extraRules: {
        'import/no-named-as-default': 'error',
        'import/no-named-as-default-member': 'error',
      },
    }),
    ...createJsonConfig(),
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        sourceType: 'commonjs',
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
    ...extraConfig
  ) as Linter.Config[]
}

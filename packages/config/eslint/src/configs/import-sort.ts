import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export function createImportSortConfig() {
  return defineConfig([
    {
      files: ['**/*.{js,jsx,ts,tsx,cjs,mjs,cts,mts}'],
      plugins: {
        import: importPlugin,
        'simple-import-sort': simpleImportSort,
      },
      rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',

        'import/first': 'error',
        'import/newline-after-import': 'error',

        'import/no-duplicates': 'error',
      },
    },
  ])
}

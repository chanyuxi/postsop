import jseslint from '@eslint/js'
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export const base = defineConfig(
  jseslint.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    extends: [
      tseslint.configs.recommended,
      // tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },

  // Additional ESLint rules for ESLint directive comments
  comments.recommended,

  // Turns off all rules that are unnecessary or might conflict with Prettier.
  prettier,
  // Runs Prettier as an ESLint rule and reports differences as individual ESLint issues.
  prettierPluginRecommended,

  // Import and Export Standards
  {
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
      import: importPlugin,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  }
)

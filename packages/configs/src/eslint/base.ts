import jseslint from '@eslint/js'
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import importXPlugin, { createNodeResolver } from 'eslint-plugin-import-x'
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export const base = defineConfig(
  jseslint.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    extends: [tseslint.configs.recommended, tseslint.configs.stylistic],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },

  // Additional ESLint rules for ESLint directive comments.
  comments.recommended,

  // Turns off all rules that are unnecessary or might conflict with Prettier.
  prettier,
  // Runs Prettier as an ESLint rule and reports differences as individual ESLint issues,
  // also beneficial for the automatic sorting function of tailwindcss class names.
  prettierPluginRecommended,

  // Import and export standards.
  // The eslint-plugin-import seems to have been neglected for a long time, which is why
  // we chose eslint-plugin-import-x, which has a more vibrant community.
  importXPlugin.flatConfigs.recommended,
  {
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: ['apps/*/tsconfig.json', 'packages/*/tsconfig.json'],
          noWarnOnMultipleProjects: true,
        }),
        createNodeResolver(),
      ],
    },
    rules: {
      'import-x/no-unresolved': 'off',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^(?!@postsop(?:/|$))@?\\w'],
            ['^@postsop(?:/|$)'],
            ['^@/'],
            ['^\\.'],
          ],
        },
      ],
    },
  }
)

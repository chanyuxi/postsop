import { defineConfig } from 'eslint/config'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export const react = defineConfig(
  reactPlugin.configs.flat.recommended,
  // Disables rules that are unnecessary with the React 17+ automatic JSX transform
  // (e.g. react/react-in-jsx-scope), since `import React from 'react'` is no longer required.
  reactPlugin.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // The official ESLint plugin for React which enforces the Rules of React and other best practices.
  reactHooksPlugin.configs.flat.recommended
)

import { defineConfig } from 'eslint/config'
import jestPlugin from 'eslint-plugin-jest'

export const testing = defineConfig({
  files: ['**/*.{spec,e2e-spec,test}.{js,jsx,ts,tsx}'],
  extends: [jestPlugin.configs['flat/recommended']],
  rules: {
    'jest/expect-expect': 'off',
  },
})

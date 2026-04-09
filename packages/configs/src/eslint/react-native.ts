// Why don't I use @react-native/eslint-config?
// 1. It is tightly coupled and harder to customize in a monorepo.
// 2. It bundles Flow-related validation that this workspace does not need.
// 3. The extracted config is easier to share across packages.

import reactNativePlugin from '@react-native/eslint-plugin'
import { defineConfig } from 'eslint/config'
import reactNativeExternalPlugin from 'eslint-plugin-react-native'

const convertGlobals = (globals: Record<string, boolean>) => {
  const converted: Record<string, 'writable' | 'readonly'> = {}

  for (const [key, value] of Object.entries(globals)) {
    converted[key] = value ? 'writable' : 'readonly'
  }

  return converted
}

const globals = {
  __DEV__: true,
  __dirname: false,
  __fbBatchedBridgeConfig: false,
  AbortController: false,
  Blob: true,
  alert: false,
  cancelAnimationFrame: false,
  cancelIdleCallback: false,
  clearImmediate: true,
  clearInterval: false,
  clearTimeout: false,
  console: false,
  document: false,
  ErrorUtils: false,
  escape: false,
  Event: false,
  EventTarget: false,
  exports: false,
  fetch: false,
  File: true,
  FileReader: false,
  FormData: false,
  global: false,
  Headers: false,
  Intl: false,
  Map: true,
  module: false,
  navigator: false,
  process: false,
  Promise: true,
  requestAnimationFrame: true,
  requestIdleCallback: true,
  require: false,
  Set: true,
  setImmediate: true,
  setInterval: false,
  setTimeout: false,
  queueMicrotask: true,
  URL: false,
  URLSearchParams: false,
  WebSocket: true,
  window: false,
  XMLHttpRequest: false,
}

export const reactNative = defineConfig({
  plugins: {
    'react-native': reactNativeExternalPlugin,
    '@react-native': reactNativePlugin,
  },
  rules: {
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-raw-text': 'off',
    'react-native/no-single-element-style-arrays': 'error',

    '@react-native/no-deep-imports': 'error',
    'react-hooks/immutability': 'off',
  },
  languageOptions: {
    globals: convertGlobals(globals),
  },
})

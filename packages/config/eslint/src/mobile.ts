import reactNativeConfig from '@react-native/eslint-config/flat'
import type { Linter } from 'eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const configWithoutFlow = (reactNativeConfig as Linter.Config[]).map(
  (config) => {
    if (!config.plugins || !('ft-flow' in config.plugins)) {
      return config
    }

    const plugins = { ...config.plugins }

    delete plugins['ft-flow']

    return {
      ...config,
      plugins,
      rules: Object.fromEntries(
        Object.entries(config.rules ?? {}).filter(
          ([ruleName]) => !ruleName.startsWith('ft-flow/')
        )
      ),
    }
  }
)

export function createReactNativeConfig() {
  return defineConfig(
    globalIgnores(['android/**', 'ios/**', 'coverage/**']),
    configWithoutFlow
  )
}

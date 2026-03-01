const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { withUniwindConfig } = require('uniwind/metro')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {}

module.exports = withUniwindConfig(
  mergeConfig(getDefaultConfig(__dirname), config),
  {
    // relative path to your global.css file (from previous step)
    cssEntryFile: './src/global.css',
  }
)

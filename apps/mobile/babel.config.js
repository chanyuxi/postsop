module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        safe: true,
        allowUndefined: false,
        allowlist: null,
        blocklist: null,
      },
    ],
    '@babel/plugin-transform-export-namespace-from',
    // Please note that this plugin must be placed at the end
    'react-native-worklets/plugin',
  ],
}

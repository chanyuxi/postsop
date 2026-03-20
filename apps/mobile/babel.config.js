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
        envName: 'NODE_ENV',
        safe: true,
        allowUndefined: false,
      },
    ],
    '@babel/plugin-transform-export-namespace-from',
    // Please note that this plugin must be placed at the end
    'react-native-worklets/plugin',
  ],
}

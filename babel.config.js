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
    '@babel/plugin-transform-export-namespace-from',
    'react-native-worklets/plugin',
  ],
}

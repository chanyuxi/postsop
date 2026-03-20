// const reactCompilerLogger = {
//   logEvent(filename, event) {
//     switch (event.kind) {
//       case 'CompileSuccess': {
//         console.log(`✅ Compiled: ${filename}`)
//         break
//       }
//       case 'CompileError': {
//         console.log(`❌ Skipped: ${filename}`)

//         console.error(`Reason: ${event.detail.reason}`)

//         if (event.detail.description) {
//           console.error(`Details: ${event.detail.description}`)
//         }

//         if (event.detail.loc) {
//           const { line, column } = event.detail.loc.start
//           console.error(`Location: Line ${line}, Column ${column}`)
//         }

//         if (event.detail.suggestions) {
//           console.error('Suggestions:', event.detail.suggestions)
//         }
//         break
//       }
//       default: {
//         console.error(`${event.kind}: ${filename}`)
//       }
//     }
//   },
// }

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // [
    //   'babel-plugin-react-compiler',
    //   {
    //     logger: reactCompilerLogger,
    //   },
    // ],
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

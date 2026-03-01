module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:prettier/recommended'],
  plugins: ['simple-import-sort', 'import'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'eol-last': ['error', 'always'],
  },
}

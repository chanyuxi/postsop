module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['simple-import-sort', 'import'],
  rules: {
    'semi': ['error', 'never'],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'eol-last': ['error', 'always'],
  },
}

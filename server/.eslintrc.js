module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  ignorePatterns: ['**/client/**/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  root: true,
  plugins: ['prettier', '@typescript-eslint'],
  rules: {}
}

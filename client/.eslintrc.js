module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  ignorePatterns: ['**/server/**/*'],
  parser: '@typescript-eslint/parser',
  root: true,
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  rules: {}
}

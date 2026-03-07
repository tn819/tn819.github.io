/* eslint-disable @typescript-eslint/no-require-imports */
const nextConfig = require('eslint-config-next')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const prettier = require('eslint-config-prettier')

module.exports = [
  { ignores: ['eslint.config.js', '.omo/skills/**'] },
  ...nextConfig,
  ...tsPlugin.configs['flat/recommended'],
  prettier,
  {
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]

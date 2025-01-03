import { default as js, default as pluginJs } from '@eslint/js'
import autoOrderImports from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: {
      'unused-imports': unusedImports,
      'simple-sort-imports': autoOrderImports
    }
  },
  {
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ]
    }
  },
  { ignores: ['node_modules', 'dist', '.env'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  js.configs.recommended
]

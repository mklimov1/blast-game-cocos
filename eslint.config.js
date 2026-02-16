// @ts-check

import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default defineConfig(
  globalIgnores([
    "/*",
    "!/assets"
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,mts,cts}', 'config/**/*.{ts,mts,cts}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      '@typescript-eslint/no-unused-vars': 'error',
      'lines-between-class-members': ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'return', next: '*' },
        { blankLine: 'any', prev: 'block-like', next: '*' },
        { blankLine: 'any', prev: '*', next: 'block-like' },
      ],
      'prefer-template': 'error',

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'prettier/prettier': 'error',
    },
  },
  prettier,
);

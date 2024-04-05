module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['dist', '.eslintrc.*'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/typescript',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'simple-import-sort',
    'prettier',
    'jsx-a11y',
    'eslint-plugin-import',
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Format
    'prettier/prettier': 'error',

    // React
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    // Import
    'sort-imports': 'off',
    'import/order': 'off',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'], // side effect (E.g."import "normalize.css"")
          ['^react$'],
          ['^[^.]'], // Libs
          ['^../|^~/|^./'],
        ],
      },
    ],

    // We should absolutely avoid using ts-ignore, but it"s not always possible.
    // particular when a dependencies types are incorrect.
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-ignore': 'allow-with-description' },
    ],

    // Allow unused variables that start with an underscore.
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    // Opinionated: no enums
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'TSEnumDeclaration',
        message: 'Prefer union type',
      },
    ],

    // Opinionated: prefer "type" over "interface"
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],

    // Disable some TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Too noisy
    // '@typescript-eslint/consistent-type-definitions': 'off', // Will come in v3
    '@typescript-eslint/no-unnecessary-condition': 'off', // TODO: Enable it
    '@typescript-eslint/prefer-ts-expect-error': 'off',
    // Allow `then()` to be called on a promise but no `catch()` called
    '@typescript-eslint/no-floating-promises': 'off',
  },
  overrides: [
    // Specials rules for testing
    {
      extends: ['plugin:vitest/recommended'],
      files: ['**/*.test.ts'],
      plugins: ['vitest'],
      rules: {
        // you should turn the original rule off *only* for test files
        '@typescript-eslint/unbound-method': 'off',
      },
    },
  ],
}

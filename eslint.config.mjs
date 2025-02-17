import globals from 'globals';
import jest from 'eslint-plugin-jest';
import eslintRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslintRecommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'prefer-const': 'warn',
      'no-unused-vars': 'off',
      semi: 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ['srcjs/*.js'],
    ...jest.configs['flat/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts'],
    rules: {
      'import/no-unresolved': 'off',
      'import/extensions': ['warn', 'never'],
    },
  },
);

import antfu from '@antfu/eslint-config';

export default antfu(
  { },
  {
    // setting
    languageOptions: {
      globals: {
        UniApp: 'readonly',
        uni: 'readonly',
        plus: 'readonly',
        process: 'readonly',
        browser: 'readonly',
      },
    },
    // style
    rules: {
      'style/quote-props': ['error', 'as-needed'],
      'style/semi': ['error', 'always'],
      'style/max-statements-per-line': ['error', { max: 1 }],
      curly: ['warn', 'all'],
      'style/member-delimiter-style': ['warn', {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: false },
        multilineDetection: 'brackets',
      }],
    },
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/manifest.json'],
    rules: {
      indent: ['error', 4],
      'jsonc/indent': ['error', 4],
    },
  },
);

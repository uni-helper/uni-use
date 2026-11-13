import uniHelper from '@uni-helper/eslint-config'

export default uniHelper({
  type: 'lib',
}, {
  files: ['test/**/*.ts'],
  rules: {
    'ts/no-require-imports': 'off',
  },
}, {
  files: ['playground/**'],
  rules: {
    'no-console': 'off',
  },
}, {
  files: ['pnpm-workspace.yaml'],
  rules: {
    'pnpm/yaml-enforce-settings': 'off',
  },
})

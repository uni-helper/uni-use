module.exports = {
  'package.json': 'sort-package-json',
  '*.md': 'markdownlint --fix --ignore-path=.gitignore',
  './src/*.{js,cjs,mjs,ts,cts,mts}': () => [
    'tsc --noEmit',
    'eslint --fix --cache --ignore-path=.gitignore',
    'publint',
  ],
};

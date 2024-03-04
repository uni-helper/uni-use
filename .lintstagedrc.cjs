module.exports = {
  '*.md': 'markdownlint --fix --ignore-path=.gitignore',
  './src/*.{js,cjs,mjs,ts,cts,mts}': () => [
    'tsc --noEmit',
    'eslint --fix --cache',
    'publint',
  ],
};

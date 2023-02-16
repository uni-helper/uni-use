module.exports = {
  '*.md': 'markdownlint --fix',
  './src/*.{js,cjs,mjs,ts,cts,mts}': 'eslint --fix --cache',
};

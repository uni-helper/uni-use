module.exports = {
  '*.{js,cjs,mjs,ts,cts,mts,md}': () => [
    'pnpm check:types',
    'pnpm lint:eslint',
    'pnpm lint:publint',
  ],
};

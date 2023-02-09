module.exports = {
  git: {
    commitMessage: 'chore(release): v${version}',
    tagName: 'v${version}',
  },
  npm: {
    publish: false
  },
  hooks: {
    'before:init': 'pnpm install && pnpm run lint',
  },
};

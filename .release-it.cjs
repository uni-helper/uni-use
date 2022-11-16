module.exports = {
  git: {
    commitMessage: 'chore(release): v${version}',
    tagName: 'v${version}',
  },
  hooks: {
    'before:init': 'pnpm install && pnpm run lint',
    'after:bump': 'pnpm run build',
  },
};
